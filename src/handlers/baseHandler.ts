import { LoggingService } from '../services';
import { ClientName, Clients, Logging } from '../constants';
import { getClients, closeClients } from '../helpers/client';

export type HandlerOptions = {
  clientNames?: ClientName[];
};

export class BaseHandler implements Logging {
  protected log: LoggingService;

  protected clientNames: ClientName[];

  protected clients: Clients;

  protected constructor(protected readonly className: string, options: HandlerOptions) {
    this.log = new LoggingService();
    this.clientNames = options.clientNames || [];
  }

  public getLogBase(functionName: string): string {
    if (!this.className) {
      throw new Error(`${BaseHandler.name}::className must be defined`);
    }

    return `${this.className}::${functionName} -> `;
  }

  protected validateEnv(): void {
    throw new Error('Must implement validateEnv function (optional)');
  }

  protected async init(): Promise<void> {
    this.clients = await getClients(this.clientNames);
  }

  protected async close(): Promise<void> {
    await closeClients(this.clients);
    this.clients = {};
  }
}
