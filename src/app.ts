import cors from 'cors';
import express, { Express } from 'express';
import routes from './routes';
import fs from 'fs';
import * as swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middleware';
import { LoggingService } from './services';

class App {
  public app: Express;
  protected log: LoggingService;

  /* Swagger files start */
  private swaggerFile: any = process.cwd() + '/src/swagger/swagger.json';
  private swaggerData: any = fs.readFileSync(this.swaggerFile, 'utf8');
  private swaggerDocument = JSON.parse(this.swaggerData);
  /* Swagger files end */

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.log = new LoggingService();
  }

  private setupMiddleware(): void {
    // enable cors
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    // TODO: add HTTP request logger middleware (morgan)
  }

  private setupRoutes(): void {
    const BASE_PATH = '/api/v1';
    debugger;
    this.app.use(BASE_PATH, routes);

    this.app.get('/health-check', async (req, res) => {
      res.status(200).send('Congratulations! API is working!');
    });

    // swagger docs
    this.app.use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(
        this.swaggerDocument,
        {
          swaggerOptions: {
            persistAuthorization: true // 👈👈
          }
        },
        null
      )
    );

    // handle undefined routes
    this.app.use('*', (req, res, next) => {
      res.send('Make sure url is correct!!!');
    });

    // Note: The order of middleware registration is important! Make sure to register middleware in the desired order.
    this.app.use(errorHandler);
  }

  public start(port: number): void {
    // TODO: Use this method to start the server and enable incoming connections.
    this.app.listen(port, () => {
      this.log.start(`App: Server is running on port ${port}`);
    });
  }
}

export default new App().app;
