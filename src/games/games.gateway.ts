import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GamesGateway implements OnGatewayInit {
  private logger = new Logger(GamesGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.on('connect', (socket) => {
      this.logger.debug(`socket connected: ${socket.id}`);
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(payload);
    return 'Hello world!';
  }
}
