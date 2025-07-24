/**
 * @author Gabriele Forner <gabriele.forner@icloud.com>
 * @brief This class is the singleton that contains, manages,
 * and abstracts external services and JWT signing key pair.
 *
 * The services managed by this singleton are the following:
 *  - SQL Database connection (generic thanks to TypeORM, but in this project using MySQL)
 *  - Redis Cache (present only on the users microservice for session JWT keys)
 *  - Apache Kafka (for producing/consuming events or replies)
 *  - JWT Key pair generation and randomization bias (random UUID to ensure session singularity)
 */

import { DataSource, EntityTarget, DeepPartial, UpdateResult, DeleteResult } from "typeorm";
import ServiceLogging from "./ServiceLogging";
import UserEntity from "../entities/UserEntity";

class Services {
    private static instance?: Services = undefined;
    private static sqlDatabase?: DataSource = undefined;

    /* Async init of connection to the DB through TypeORM */
    private static async initSQL(): Promise<DataSource> {
        if (!process.env.DB_HOST || process.env.DB_HOST.length === 0) {
            throw new Error(`SQL Database hostname is not set or invalid (${process.env.DB_HOST})`);
        }
        if (!process.env.DB_PORT) {
            throw new Error(`SQL Database port is not set or invalid (${process.env.DB_PORT})`);
        }

        const ds = new DataSource({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_DATABASE,
            username: process.env.DB_SERVICE_USERNAME,
            password: process.env.DB_SERVICE_PASSWORD,

            entities: [
                UserEntity
            ]
        });

        try {
            await ds.initialize();
            ServiceLogging.logInfo("SQL service connected");
            return ds;
        } catch (err) {
            ServiceLogging.logError(`Failed to initialize SQL Database: ${err}`);
            throw err;
        }
    }

    /* (user-service-only) Async init to the Redis cache */
    private static async initCache() {
        return undefined;
    }

    /* Async init to the Apache Kafka cluster */
    private static async initKafka() {
        return undefined;
    }

    public static async getInstance(): Promise<Services> {
        if (!this.instance) {
            ServiceLogging.logInfo("Enabling Services...");
            this.instance = new Services();
            const [sql, cache, kafka] = await Promise.all([
                this.initSQL(),
                this.initCache(),
                this.initKafka()
            ]);
            this.sqlDatabase = sql;
        }
        return this.instance;
    }
}

export default Services;