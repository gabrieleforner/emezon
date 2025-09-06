/*
    @author Gabriele Forner <gabriele.forner@icloud.com>
    @brief This file export a class that abstracts the connection to a
           Redis instance and common usage functions using redis-node.
 */

import {createClient, RedisClientType} from 'redis';
import {REDIS_HOST,REDIS_PORT} from "@utils/CommonStrings";


export class RedisConnection {
    private client: RedisClientType;
    private redisConnectionString: string = `redis://${REDIS_HOST}:${REDIS_PORT}`
    constructor() {
        this.client = createClient({
          url: this.redisConnectionString,
        })
        this.client.on('connect', () => {
            console.log(`Server connected to Redis (${this.redisConnectionString})`)
        })
        this.client.on('error', (err: Error)=>{
            console.error(`Failed to connect to redis server: ${REDIS_HOST}`);
            console.error(`Error: ${err.message}`);
            console.error(err.stack);
            process.exit(-1);
        })
        this.client.connect();
    };

    // NOTE: Common operations abstracted to obtain better testability
    // Create
    public async addValue(key: string, value: any) {
        await this.client.set(key, value);
    }
    public async addValueWithTTL(key: string, value: any, ttlMilliseconds: number) {
        await this.client.set(key, value, { EX: ttlMilliseconds});
    }
    // Read
    public async readValue(key: string) {
        return await this.client.get(key);
    }
    // Update
    public async updateValue(key: string, value: any) {
        const ttl = await this.client.ttl(key)
        if(ttl > 0) {
            await this.client.set(key, value, { EX: ttl });
        }
        else {
            await this.client.set(key, value);
        }
    }
    // Delete
    public async deleteValue(key: string) {
        await this.client.del(key);
    }

}
const redisConnection = new RedisConnection();
export default redisConnection;