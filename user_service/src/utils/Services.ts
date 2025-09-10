import {
    SQL_DATABASE_DRIVER,
    SQL_DATABASE_HOST,
    SQL_DATABASE_PORT,
    SQL_DATABASE_USERNAME,
    SQL_DATABASE_PASSWORD,
    SQL_DATABASE_NAME,
    REDIS_HOST,
    REDIS_PORT,
    KAFKA_PORT,
    KAFKA_HOST,
} from '@utils/CommonStrings'
import {
    DataSource,
    ObjectLiteral,
    EntityTarget,
    DeepPartial,
    FindOptionsWhere
} from "typeorm"
import { User } from "@models/UserModel"
import { createClient, RedisClientType } from 'redis'
import { Consumer, Kafka, Producer } from 'kafkajs'

class Services {
    private static instance: Services
    private dataSource!: DataSource
    private redisClient!: RedisClientType
    
    private kafkaCluster!: Kafka
    private kafkaProducer!: Producer

    private redisConnectionString: string = `redis://${REDIS_HOST}:${REDIS_PORT}`
    private constructor() { }
    public static getInstance() {
        if (!this.instance) {
            this.instance = new Services()
        }
        return this.instance
    }
    public async init() {
        // Setup Apache Kafka
        this.kafkaCluster = new Kafka({
            clientId: "user-microservice",
            brokers: [
                `${KAFKA_HOST}:${KAFKA_PORT}`
            ],
        })
        this.kafkaProducer = this.kafkaCluster.producer()
        await this.kafkaProducer.connect()
            .catch((e: Error)=>{ throw e })
            .then(()=>{ console.log(`Server connected to Kafka (as producer) (kafka://${KAFKA_HOST}:${KAFKA_PORT})`) })

        // Setup SQL Database connection
        this.dataSource = new DataSource({
            type: SQL_DATABASE_DRIVER as "mysql" | "postgres" | "mssql",
            host: SQL_DATABASE_HOST,
            port: SQL_DATABASE_PORT,
            username: SQL_DATABASE_USERNAME,
            password: SQL_DATABASE_PASSWORD,
            database: SQL_DATABASE_NAME,
            synchronize: true,
            entities: [User],
            logging: false,
        })
        await this.dataSource.initialize().catch(error => {
            console.error("DB Init Error:", error)
            process.exit(-1)
        })
        console.log("Server connected to SQL server")
        this.redisClient = createClient({
            url: this.redisConnectionString,
        })
        this.redisClient.on('connect', () => {
            console.log(`Server connected to Redis (${this.redisConnectionString})`)
        })
        this.redisClient.on('error', (error: Error) => {
            console.error(`Failed to connect to redis server: ${REDIS_HOST}`)
            console.error(`Error: ${error.message}`)
            console.error(error.stack)
            process.exit(-1)
        })
        await this.redisClient.connect()
        console.log("Server connected to Redis server")
    }


    // Kafka produce event
    public async produceKafkaEvent(topic: string, value: any) {
        await this.kafkaProducer.send({
            topic: topic,
            messages: [
                { value: value }
            ],
        })
    }

    // TypeORM CRUD
    public async addNewEntity<T extends ObjectLiteral>(entity: EntityTarget<T>, entityData: DeepPartial<T>): Promise<T | unknown> {
        return this.dataSource.getRepository<T>(entity)
            .save(entityData)
            .catch(error => error as unknown)
    }
    // READ (find all)
    public async getAllEntities<T extends ObjectLiteral>(entity: EntityTarget<T>): Promise<T[] | unknown> {
        return this.dataSource.getRepository<T>(entity)
            .find()
            .catch(error => error as unknown)
    }
    // READ (find by condition)
    public async getEntity<T extends ObjectLiteral>(entity: EntityTarget<T>, where: FindOptionsWhere<T>): Promise<T | null | unknown> {
        return this.dataSource.getRepository<T>(entity)
            .findOneBy(where)
            .catch(error => error as unknown)
    }
    // UPDATE
    public async updateEntity<T extends ObjectLiteral>(entity: EntityTarget<T>, criteria: FindOptionsWhere<T>, updateData: DeepPartial<T>): Promise<T | unknown> {
        try {
            const repo = this.dataSource.getRepository<T>(entity)
            await repo.update(criteria, updateData as any) // cast se TS si lamenta
            return repo.findOneBy(criteria)
        } catch (error) {
            return error as unknown
        }
    }
    // DELETE
    public async deleteEntity<T extends ObjectLiteral>(entity: EntityTarget<T>, criteria: FindOptionsWhere<T>): Promise<boolean | unknown> {
        try {
            const repo = this.dataSource.getRepository<T>(entity)
            const result = await repo.delete(criteria)
            return (result.affected ?? 0) > 0
        } catch (error) {
            return error as unknown
        }
    }

    // Redis CRUD
    public async addRedisValue(key: string, value: any) {
        await this.redisClient.set(key, value)
    }
    public async addRedisValueWithTTL(key: string, value: any, ttlMilliseconds: number) {
        await this.redisClient.set(key, value, { EX: ttlMilliseconds })
    }
    // Read
    public async readRedisValue(key: string) {
        return await this.redisClient.get(key)
    }
    // Update
    public async updateRedisValue(key: string, value: any) {
        const ttl = await this.redisClient.ttl(key)
        if (ttl > 0) {
            await this.redisClient.set(key, value, { EX: ttl })
        }
        else {
            await this.redisClient.set(key, value)
        }
    }
    // Delete
    public async deleteRedisValue(key: string) {
        await this.redisClient.del(key)
    }
};
export default Services;