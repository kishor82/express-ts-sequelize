import { PgClient } from '../clients';

export enum ClientName {
  PgClient = 'PgClient'
}

export interface Clients {
  PgClient?: PgClient;
}
