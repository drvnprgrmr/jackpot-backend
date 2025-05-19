import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GamesGuard implements CanActivate {
  private readonly logger = new Logger(GamesGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // only handle websocket connections
    if (context.getType() !== 'ws') return false;

    const socket = context.switchToWs().getClient<Socket>();

    this.logger.debug(socket.data);

    function error(message: string, data?: Record<string, any>) {
      throw new WsException({ message, data });
    }

    const token =
      socket.handshake.headers.authorization?.split(' ')[1] ||
      (socket.handshake.auth.token as string);

    if (!token) error('Token not present!');

    let payload: { sub: string } = { sub: '' };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch (err) {
      if (err instanceof TokenExpiredError)
        error(err.message, { expiredAt: err.expiredAt });
      else if (err instanceof JsonWebTokenError) error(err.message);
    }

    const user = await this.usersService.getUserById(payload.sub);

    if (!user) error('User does not exist!');

    return true;
  }
}
