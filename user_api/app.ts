import express, { Express } from 'express';
import sessionHandlingRouter from './routes/sessionController';
import DatabaseConnection from './util/databaseConnection';

const apiServerPort: number = 8080;
const apiServerInst: Express = express();

apiServerInst.use(express.json());
apiServerInst.use('/', sessionHandlingRouter);

DatabaseConnection.getInstance();
apiServerInst.listen(apiServerPort, () => {
    console.info('[INFO]\tAPI server listening on port 8080');
});