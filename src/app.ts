import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application, type Request, type Response } from 'express';
import router from './app/routes';
import notFound from './app/middleware/notFound';
import globalErrorHandler from './app/middleware/globalErrorHandler';

const app: Application = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

//parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Health Care is running..",
        environment: "development",
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;