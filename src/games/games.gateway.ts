import { Logger } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { GamesService } from './games.service';
import { GameStatus } from './schemas/game.schema';
import { Types } from 'mongoose';

interface SocketData {
  userId: string;
  username: string;
}

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
    private readonly gamesService: GamesService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {}

  async handleAuth(socket: Socket) {
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

    socket.data = { userId: user.id as string, username: user.username };

    this.logger.verbose('Client connected.', {
      user: user.id as string,
      socket: socket.id,
    });
  }

  async handleConnection(socket: Socket) {
    await this.handleAuth(socket);
  }

  handleDisconnect(socket: Socket) {
    this.logger.verbose('Socket disconnectd.', { socketId: socket.id });
  }

  @SubscribeMessage('hello')
  handleMessage(socket: Socket) {
    const socketData = socket.data as SocketData;
    return {
      message: `Hello, ${socketData.username}!`,
      data: { rooms: socket.rooms },
    };
  }

  @SubscribeMessage('join-room')
  async onJoinRoom(socket: Socket, roomName: string) {
    const socketData = socket.data as SocketData;

    // get game room to be joined
    const game = await this.gamesService.gameModel
      .findOne({ roomName, status: GameStatus.PENDING })
      .exec();

    // return if room is not available
    if (!game) return { message: 'room is not available', status: 'error' };

    // return if room is full
    if (game.players.length === game.teamCount * 2)
      return { message: 'room is full', status: 'error' };

    // return if user is already in the game
    if (
      game.players.find((player) => {
        const playerUser = player.user as Types.ObjectId;
        return playerUser.equals(socketData.userId);
      })
    )
      return { message: 'user already in room', status: 'error' };

    // add player to game document
    const player = game.players.create({ user: socketData.userId, cards: [] });
    game.players.push(player);

    // get incomplete team
    let team = game.teams.find((team) => team.players.length < 2);

    // create new team for player if other teams are full
    if (!team) {
      team = game.teams.create({ players: [player.id] });
      game.teams.push(team);
    }
    // add user to existing team
    else {
      const teamPlayers = team.players as string[];
      teamPlayers.push(player.id as string);
    }

    // add the socket to the room
    await socket.join(roomName);

    // save game
    await game.save();

    // alert other room members on socket joining room
    socket
      .to(roomName)
      .emit('join-room', { ...socketData, teamName: team.name });

    return {
      message: 'done',
      status: 'success',
      data: { teamName: team.name },
    };
  }
}
