import { getPgClient } from './db';
import { ClientName, Clients } from '../constants';

export const getClients = async (clientNames: ClientName[]): Promise<Clients> => {
  const clients: Partial<Clients> = {};

  for (const clientName of clientNames) {
    if (clientName === ClientName.PgClient) {
      clients.PgClient = await getPgClient();
    }
  }
  return clients;
};

export const closeClients = async (clients: Clients): Promise<void> => {
  if (!clients) {
    return;
  }

  if (clients.PgClient?.close) await clients.PgClient.close();
};
