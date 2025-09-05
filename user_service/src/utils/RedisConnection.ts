/*
    @author Gabriele Forner <gabriele.forner@icloud.com>
    @brief This file export a variable representing the connection to a
           Redis instance with ioredis.
 */
import { createClient } from 'redis';
import {REDIS_HOST,REDIS_PORT} from "@utils/CommonStrings";

const redisClient = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
redisClient.on('connect', ()=>{
    console.log(`Server connected to Redis (redis://${REDIS_HOST}:${REDIS_PORT})`);
});
redisClient.on('error', (err) => {
    console.log(`Server failed to connect to Redis: ${err}`);
    process.exit(-1);
})
export default redisClient;