import { PgClient } from '../clients';
import { timeElapsed, log } from '.';

let PgConnection: PgClient;

export const getPgClient = async (): Promise<PgClient> => {
  const start = new Date();
  const logName = 'getPgClient ->';
  if (!PgConnection) {
    log.debug(`${logName}`, 'Creating new pgClient...');

    PgConnection = new PgClient({
      databaseName: process.env.PG_DB_NAME || 'pg',
      username: process.env.PG_USERNAME || 'local',
      password: process.env.PG_PASSWORD || 'evsbvFm3QR',
      host: process.env.PG_HOST || 'localhost',
      port: parseInt(process.env.PG_PORT, 10) || 5432,
      readers: [{ host: process.env.PG_READER_HOST || 'localhost', port: parseInt(process.env.PG_READER_PORT, 10) || 5432 }]
    });

    await PgConnection.connect();
  } else {
    log.debug(`${logName} Restoring the existing database connection`);
    await PgConnection.restoreSequelizeConnection();
  }

  const end = new Date();
  log.info(logName, { timeElapsed: timeElapsed(start, end) });

  return PgConnection;
};
