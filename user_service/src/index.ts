/*
    @author Gabriele Forner <gabriele.forner@icloud.com>
    @brief This file is the server entrypoint
 */

import express from 'express'
import authenticationRoutes from "@routes/AuthenticationRoutes"
import userInfoRoutes from "@routes/UserInfoRoutes"
import { User } from '@models/UserModel';
import { createHash } from 'crypto';
import Services from '@utils/Services';
import { ADMIN_ROLE } from '@utils/CommonStrings';

const serverPort: number = 3000
const serverHost: string = "0.0.0.0";

(async ()=> {
    // Generate default adminstrator account
    const DEFADMIN_EMAIL: string = "admin@mockemail.com"
    const DEFADMIN_USERNAME: string = "admin"
    const DEFADMIN_PASSWORD: string = "admin"

    try {
        await Services.getInstance().init()
        await Services.getInstance().addNewEntity(User, {
            email: DEFADMIN_EMAIL,
            username: DEFADMIN_USERNAME,
            passwordHash: createHash('sha256')
                .update(DEFADMIN_PASSWORD)
                .digest('hex'),
            roles: [ADMIN_ROLE],

            name: DEFADMIN_USERNAME,
            surname: DEFADMIN_USERNAME,
        })
        .then(()=>{
            console.log(`Adminstrator default account:`)
            console.log(`\tEmail: ${DEFADMIN_EMAIL} `)
            console.log(`\tUsername: ${DEFADMIN_USERNAME}`)
            console.log(`\tPassword: ${DEFADMIN_PASSWORD}`)
        })
        .catch((err: Error) => {
            throw err
        })
    }
    catch (error) {
        console.error(`Failed to connect to external services`)
        console.error(`\tError message: ${(error as Error).message}`)
        console.error(`\tError originated from: ${(error as Error).stack}`)
        process.exit(-1)
    }

    Services.getInstance().produceKafkaEvent('user-events', 'GenericKafkaEvent')

    const server = express()
    server.use(express.json())
    server.use(`/auth`, authenticationRoutes)
    server.use(`/user`, userInfoRoutes)

    server.listen(serverPort, serverHost, (e)=>{
        if(e instanceof Error) {
            console.error(`Failed to start Express server`)
            console.error(`\tError message: ${e.message}`)
            console.error(`\tError originated from: ${e.stack}`)
            process.exit(-1)
        }
        console.log(`Server started successfully (http://${serverHost}:${serverPort}/)`)
    })
})()