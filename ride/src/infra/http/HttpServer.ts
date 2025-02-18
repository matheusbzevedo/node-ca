import Hapi from '@hapi/hapi';
import express, { Request, Response } from 'express';

export default interface HttpServer {
  listen(port: number): void;
  register(method: string, url: string, callback: Function): void;
}

export class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  listen(port: number): void {
    this.app.listen(port, () => `Running on port ${port}`);
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](
      url,
      async function (request: Request, response: Response) {
        try {
          const output = await callback(request.params, request.body);

          return response.json(output);
        } catch (error: any) {
          response.status(422).json({ message: error.message });
        }
      },
    );
  }
}

export class HapiAdapter implements HttpServer {
  server: Hapi.Server;

  constructor() {
    this.server = Hapi.server();
  }

  listen(port: number): void {
    this.server.settings.port = port;
    this.server.start();
  }

  register(method: any, url: string, callback: Function): void {
    this.server.route({
      method,
      path: url,
      handler: async function (request: any, reply: any) {
        try {
          const output = await callback(request.params, request.payload);

          return output;
        } catch (error: any) {
          return reply.response({ message: error.message }).code(422);
        }
      },
    });
  }
}
