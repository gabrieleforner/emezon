/**
 * @author Gabriele Forner <gabriele.forner@icloud.com>
 * @brief This file is the entrypoint of the users microservice
 * API server, where is managed the boot of the Express server
 * and external service instances (such as MySQL, Redis, etc.)
 * */

import express, {Express} from 'express';
import ServiceLogging from "./utils/ServiceLogging";

async function startAPIServer() {
    const server: Express = express();
    const port: Number = Number(process.env.SERVER_PORT);

    try {
        if(port === undefined) {
            throw new Error('Missing server port or invalid value');
        }
        server.use(express.json());
        server.get('/', async (req, res) => {
            res.json({ status: 'ccakrk' });
        });

        server.listen(port, function () {
            ServiceLogging.logInfo(`API Server running on port ${port}`);
        });
    }
    catch(e) {
        ServiceLogging.logError(`Failed to start API server: ${e}`);
    }
}
startAPIServer();