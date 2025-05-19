import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  BaseWsExceptionFilter,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway()
export class GamesGateway
  implements
    OnGatewayInit<Server>,
    OnGatewayConnection<Socket>,
    OnGatewayDisconnect<Socket>
{
  private logger = new Logger(GamesGateway.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {}

  async handleConnection(socket: Socket) {
    this.logger.debug('Socket connected', {
      socketId: socket.id,
      data: socket.data,
    });

    const error = (message: string, data?: Record<string, any>) => {
      socket.emit('exception', { message, data });
      this.logger.error(message, data);
      socket.disconnect();
    };

    const token =
      socket.handshake.headers.authorization?.split(' ')[1] ||
      (socket.handshake.auth.token as string);

    if (!token) return error('Token not present!');

    let payload: { sub: string } = { sub: '' };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch (err) {
      if (err instanceof TokenExpiredError)
        return error(err.message, { expiredAt: err.expiredAt });
      else if (err instanceof JsonWebTokenError) return error(err.message);
    }

    const user = await this.usersService.getUserById(payload.sub);

    if (!user) return error('User does not exist!');

    socket.data = { userId: user.id };
    this.logger.verbose('Client connected.', {
      user: user.id,
      socket: socket.id,
    });
  }

  handleDisconnect(socket: Socket) {
    this.logger.verbose('Socket disconnectd.', { socketId: socket.id });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(payload);
    return 'Hello world!';
  }
}
