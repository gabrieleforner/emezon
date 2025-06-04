import express, { Express } from 'express';
import sessionHandlingRouter from './routes/sessionController';
import ServiceContext from './util/serviceContext';

const apiServerPort: number = 8080;
const apiServerInst: Express = express();

apiServerInst.use(express.json());
apiServerInst.use('/', sessionHandlingRouter);

ServiceContext.getInstance();
apiServerInst.listen(apiServerPort, () => {
    console.info('[INFO]\tAPI server listening on port 8080');
});