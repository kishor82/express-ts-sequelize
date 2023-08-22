import { Logging } from '../constants';
import { LoggingService } from '../services';

export interface BaseClientOptions {}
export class BaseClient implements Logging {
  protected log: LoggingService;

  protected options: BaseClientOptions;

  constructor(
    protected readonly className: string,
    options: BaseClientOptions = {}
  ) {
    this.log = new LoggingService();
    this.options = options;
  }

  getLogBase(fnName: string): string {
    if (!this.className) throw new Error(`${BaseClient.name}::className must be defined`);
    return `${this.className}::${fnName} -> `;
  }
}
