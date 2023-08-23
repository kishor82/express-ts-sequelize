import http from 'http';
import app from './app';
import { config } from './config';
import { LoggingService } from './services';

const log = new LoggingService();
// Create an HTTP server instance using http.createServer()
// This approach gives you fine-grained control over the server
// and is useful for custom networking scenarios or when integrating
// multiple libraries with the same server instance.
const server = http.createServer(app);

server.listen(config.port, () => {
  const serverAddress = server.address();
  console.log('started.....');
  // const host = serverAddress.address;
  // const port = serverAddress.port;
  log.start(`Listening to port ${config.port}`, {
    serverAddress
  });
  log.start(`Swagger documentation available at /api/docs`);
});

// Listen for the 'SIGINT', 'SIGTERM', and 'SIGQUIT' signals
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
  process.on(signal, () => {
    log.start(`Server is shutting down on port: ${config.port}`);
    server.close(() => {
      log.finish(`Server has been closed on port: ${config.port}`);
      process.exit(0);
    });
  });
});
