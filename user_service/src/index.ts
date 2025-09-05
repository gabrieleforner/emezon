/*
    @author Gabriele Forner <gabriele.forner@icloud.com>
    @brief This file is the server entrypoint
 */

import express from 'express';
import sqlDataSource from "@utils/SQLConnection";
import redisClient from "@utils/RedisConnection";
import {SQL_DATABASE_DRIVER, SQL_DATABASE_HOST, SQL_DATABASE_PORT} from "@utils/CommonStrings";
import authenticationRoutes from "@routes/AuthenticationRoutes";
import userInfoRoutes from "@routes/UserInfoRoutes";

const serverPort: number = 3000;
const serverHost: string = '0.0.0.0';

(async ()=> {
    await redisClient.connect().catch((e)=>{ console.error(e); });
    await sqlDataSource.initialize()
        .then(()=>{
            console.log(`${SQL_DATABASE_DRIVER.toUpperCase()} database (${SQL_DATABASE_HOST}:${SQL_DATABASE_PORT}) connected`);
        })
        .catch((e)=>{
            console.error(e);
            process.exit(-1);
        });
    const server = express();
    server.use(express.json());
    server.use(`/auth`, authenticationRoutes);
    server.use(`/`, userInfoRoutes);

    server.listen(serverPort, serverHost, (e)=>{
        if(e instanceof Error) {
            console.error(`Failed to start Express server`);
            console.error(`Error message: ${e.message}`);
            console.error(`Error originated from: ${e.stack}`);
        }
        console.log(`Server started successfully (http://${serverHost}:${serverPort}/)`);
    });
})()