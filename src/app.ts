import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import routes from './routes';
import { getClients } from './helpers/client';
import { ClientName } from './constants';

// process.env.PWD = process.cwd();

export const app: Express = express();

getClients([ClientName.PgClient]);

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
