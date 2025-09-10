/*
    @author Gabriele Forner <gabriele.forner@icloud.com>
    @brief This file collects all strings that are used across the
           entire service, and if they are environment variables,
           they are defaulted.
 */

// SQL database configuration variables
// config/env.ts
export const SQL_DATABASE_DRIVER = process.env.SQL_DATABASE_DRIVER ?? "mysql"
export const SQL_DATABASE_HOST   = process.env.SQL_DATABASE_HOST   ?? "localhost"
export const SQL_DATABASE_PORT   = Number(process.env.SQL_DATABASE_PORT ?? 3306)
export const SQL_DATABASE_USERNAME = process.env.SQL_DATABASE_USERNAME ?? "root"
export const SQL_DATABASE_PASSWORD = process.env.SQL_DATABASE_PASSWORD ?? "root"
export const SQL_DATABASE_NAME     = process.env.SQL_DATABASE_NAME     ?? "database"

// Redis configuration variables
export const REDIS_HOST = process.env.REDIS_HOST ?? "localhost"
export const REDIS_PORT = Number(process.env.REDIS_PORT ?? 6379)

// Kafka config
export const KAFKA_HOST = process.env.KAFKA_HOST ?? "localhost"
export const KAFKA_PORT = Number(process.env.KAFKA_PORT) ?? 9092

// Kafka Topics
export const USER_EVENTS_TOPIC = process.env.USER_EVENTS_TOPIC ?? "user-events"

// Application Roles
export const ADMIN_ROLE = "admin"
export const SELLER_ROLE = "seller"
export const USER_ROLE = "user"
