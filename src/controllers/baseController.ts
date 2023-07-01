import { Logging } from '../constants';
import { LoggingService } from '../services';

export class BaseController implements Logging {
  protected log: LoggingService;

  protected constructor(protected readonly className: string) {
    this.log = new LoggingService();
    this.validate();
  }

  public getLogBase(functionName: string): string {
    if (!this.className) {
      throw new Error('BaseController::className must be defined');
    }

    return `${this.className}::${functionName} -> `;
  }

  /**
   * Validate environment variables and options variables.
   *   - Implement your own validate method in the extending class
   *   - Throw an error if any variables or options are invalid
   */
  protected validate(): void {}
}
