/*
    @author Gabriele Forner <gabriele.forner@icloud.com>
    @brief This file export a variable representing the connection to a generic
           SQL database server with TypeORM.(By default it will use MySQL, in case
           change SQL_DATABASE_DRIVER env var and install the driver with NPM)

 */
import {
    DataSource,
    ObjectLiteral,
    EntityTarget,
    DeepPartial,
    FindOptionsWhere
} from "typeorm"
import { User } from "@models/UserModel"

import {
    SQL_DATABASE_DRIVER,
    SQL_DATABASE_HOST,
    SQL_DATABASE_PORT,
    SQL_DATABASE_USERNAME,
    SQL_DATABASE_PASSWORD,
    SQL_DATABASE_NAME,
} from '@utils/CommonStrings'

export class SQLConnection {
    private dataSource: DataSource

    constructor() {
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
        this.dataSource.initialize().catch(error => {
            console.error("DB Init Error:", error)
            process.exit(-1)
        })
        console.log("Server connected to SQL server")
    }

    // CREATE
    public async addNewEntity<T extends ObjectLiteral>(
        entity: EntityTarget<T>,
        entityData: DeepPartial<T>
    ): Promise<T | unknown> {
        return this.dataSource.getRepository<T>(entity)
            .save(entityData)
            .catch(error => error as unknown)
    }

    // READ (find all)
    public async getAllEntities<T extends ObjectLiteral>(
        entity: EntityTarget<T>
    ): Promise<T[] | unknown> {
        return this.dataSource.getRepository<T>(entity)
            .find()
            .catch(error => error as unknown)
    }

    // READ (find by condition)
    public async getEntity<T extends ObjectLiteral>(
        entity: EntityTarget<T>,
        where: FindOptionsWhere<T>
    ): Promise<T | null | unknown> {
        return this.dataSource.getRepository<T>(entity)
            .findOneBy(where)
            .catch(error => error as unknown)
    }

    // UPDATE
    public async updateEntity<T extends ObjectLiteral>(
        entity: EntityTarget<T>,
        criteria: FindOptionsWhere<T>,
        updateData: DeepPartial<T>   // <-- torna DeepPartial
    ): Promise<T | unknown> {
        try {
            const repo = this.dataSource.getRepository<T>(entity)
            await repo.update(criteria, updateData as any) // cast se TS si lamenta
            return repo.findOneBy(criteria)
        } catch (error) {
            return error as unknown
        }
    }

    // DELETE
    public async deleteEntity<T extends ObjectLiteral>(
        entity: EntityTarget<T>,
        criteria: FindOptionsWhere<T>
    ): Promise<boolean | unknown> {
        try {
            const repo = this.dataSource.getRepository<T>(entity)
            const result = await repo.delete(criteria)
            return (result.affected ?? 0) > 0
        } catch (error) {
            return error as unknown
        }
    }
}

const sqlConnection = new SQLConnection()
export default sqlConnection
