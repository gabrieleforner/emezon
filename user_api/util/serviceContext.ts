import { Pool, RowDataPacket, createPool } from "mysql2/promise";
import { Redis } from "ioredis";

export class ServiceContext {
  private static instance: ServiceContext;
  private jwtPublicKey: any;
  private jwtPrivateKey: any;
  private mysqlConnection: Pool;
  private redisConnection: Redis;

  private constructor() {
    try {
      if (String(process.env.MYSQL_HOSTNAME) == null) throw Error("MYSQL_HOSTNAME is not set or invalid");
      if (Number(process.env.MYSQL_PORT) == null) throw Error("MYSQL_PORT is not set or invalid");
      if (String(process.env.MYSQL_USER) == null) throw Error("MYSQL_USER is not set or invalid");
      if (String(process.env.MYSQL_PASSWORD) == null) throw Error("MYSQL_PASSWORD is not set or invalid");
      if (String(process.env.MYSQL_DATABASE) == null) throw Error("MYSQL_DATABASE is not set or invalid");

      this.mysqlConnection = createPool({
        host: String(process.env.MYSQL_HOSTNAME),
        port: Number(process.env.MYSQL_PORT),
        user: String(process.env.MYSQL_USER),
        password: String(process.env.MYSQL_PASSWORD),
        database: String(process.env.MYSQL_DATABASE)
      })
      this.mysqlConnection.getConnection()
        .then(conn => {
          conn.release();
            const connectionString = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOSTNAME}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`;
          console.info(`[INFO]\tApplication connected to MySQL DB (${connectionString})`);
        })
        .catch(err => {
          throw new Error(`Failed to connect to MySQL: ${err.message}`);
        });

      if (String(process.env.REDIS_HOSTNAME) == null) throw Error("REDIS_HOSTNAME is not set or invalid");
      if (Number(process.env.REDIS_PORT) == null) throw Error("REDIS_PORT is not set or invalid");
      this.redisConnection = new Redis({
        host: String(process.env.REDIS_HOSTNAME),
        port: Number(process.env.REDIS_PORT)
      });
      this.redisConnection.ping()
        .then(() => {
          const redisConnectionString = `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}/`;
          console.info(`[INFO]\tApplication connected to Redis (${redisConnectionString})`);
        })
        .catch(err => {
          throw new Error(`Failed to connect to Redis: ${err.message}`);
        });

    } catch (error) {
      console.error(`[FATAL]\tApplication init failure: \n${error}`);
      process.exit(-1);
    }
  }

  public static getInstance(): ServiceContext {
    if (!ServiceContext.instance) {
      ServiceContext.instance = new ServiceContext();
    }
    return ServiceContext.instance;
  }

  public async query<T = RowDataPacket>(sql: string, params?: any[]): Promise<T[]> {
    const [rows] = await this.mysqlConnection.execute(sql, params);
    return rows as T[];
  }

  public getRedisClient(): Redis {
    return this.redisConnection;
  }
}

export default ServiceContext;