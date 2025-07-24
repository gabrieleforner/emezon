/**
 * @author Gabriele Forner <gabriele.forner@icloud.com>
 * @brief This file is the entrypoint of the users microservice
 * API server, where is managed the boot of the Express server
 * and external service instances (such as MySQL, Redis, etc.)
 * */

import express, {Express} from 'express';
import ServiceLogging from "./utils/ServiceLogging";
import Services from "./utils/Services";
import UserEntity from "./entities/UserEntity";

async function startAPIServer() {
    const server: Express = express();
    const port: Number = Number(process.env.SERVER_PORT);

    try {
        if(isNaN(Number(port))) {
            throw new Error(`Missing server port or invalid value ${port}`);
        }

        server.use(express.json());
        server.get('/', async (req, res) => {
            res.json({ status: 'ccakrk' });
        });
        await Services.getInstance();    // Init external services

        server.listen(port, function () {
            ServiceLogging.logInfo(`API Server running on port ${port}`);
        });
    }
    catch(e) {
        ServiceLogging.logError(`Failed to start API server: ${(e as Error).message}`);
        process.exit(-1);
    }
}
startAPIServer();