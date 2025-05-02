import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SessionsService } from './sessions.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SessionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private sessionsService: SessionsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinSession')
  async handleJoinSession(client: Socket, sessionId: string) {
    client.join(sessionId);
    const session = await this.sessionsService.getSession(sessionId);
    if (session?.songId) {
      const song = await this.sessionsService.getCurrentSong(sessionId);
      client.emit('songChanged', song);
    }
  }

  @SubscribeMessage('leaveSession')
  handleLeaveSession(client: Socket, sessionId: string) {
    client.leave(sessionId);
  }

  @SubscribeMessage('selectSong')
  @UseGuards(JwtAuthGuard)
  async handleSelectSong(client: Socket, data: { sessionId: string; songId: string }) {
    const { sessionId, songId } = data;
    const session = await this.sessionsService.updateSession(sessionId, songId);
    if (session) {
      const song = await this.sessionsService.getCurrentSong(sessionId);
      this.server.to(sessionId).emit('songChanged', song);
    }
  }

  @SubscribeMessage('endSession')
  @UseGuards(JwtAuthGuard)
  async handleEndSession(client: Socket, sessionId: string) {
    await this.sessionsService.endSession(sessionId);
    this.server.to(sessionId).emit('sessionEnded');
  }
} 