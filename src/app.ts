import cors from 'cors';
import express, { Express } from 'express';
import routes from './routes';

// process.env.PWD = process.cwd();

export const app: Express = express();

// enable cors
// options for cors middleware
app.use(cors());
// app.use(express.static(`${process.env.PWD}/public`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TODO: add HTTP request logger middleware (morgan)

const PATH = {
  API: '/api/v1'
};

app.use(PATH.API, routes);

app.get('/health-check', async (req, res) => {
  res.status(200).send('Congratulations! API is working!');
});
