/*
    @author Gabriele Forner <gabriele.forner@icloud.com>
    @brief This file is the server entrypoint
 */

import express from 'express'
import authenticationRoutes from "@routes/AuthenticationRoutes"
import userInfoRoutes from "@routes/UserInfoRoutes"

const serverPort: number = 3000
const serverHost: string = "0.0.0.0";

(async ()=> {
    const server = express()
    server.use(express.json())
    server.use(`/auth`, authenticationRoutes)
    server.use(`/user`, userInfoRoutes)

    server.listen(serverPort, serverHost, (e)=>{
        if(e instanceof Error) {
            console.error(`Failed to start Express server`)
            console.error(`Error message: ${e.message}`)
            console.error(`Error originated from: ${e.stack}`)
        }
        console.log(`Server started successfully (http://${serverHost}:${serverPort}/)`)
    })
})()