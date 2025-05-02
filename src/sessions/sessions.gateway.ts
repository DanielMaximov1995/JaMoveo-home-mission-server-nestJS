import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SessionsService } from './sessions.service';

interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  chords: string;
  imageUrl: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(JwtAuthGuard)
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
  async handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() sessionId: string,
  ) {
    client.join(sessionId);
    // Notify other clients that a new user joined
    this.server.to(sessionId).emit('userJoined', { userId: client.id });
  }

  @SubscribeMessage('selectSong')
  async handleSelectSong(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; song: Song },
  ) {
    // Broadcast the selected song to all clients in the session
    this.server.to(data.sessionId).emit('songSelected', data.song);
  }

  @SubscribeMessage('endSession')
  async handleEndSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() sessionId: string,
  ) {
    this.server.to(sessionId).emit('sessionEnded');
  }

  @SubscribeMessage('playSong')
  async handlePlaySong(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; currentTime: number },
  ) {
    this.server.to(data.sessionId).emit('playSong', { currentTime: data.currentTime });
  }

  @SubscribeMessage('pauseSong')
  async handlePauseSong(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; currentTime: number },
  ) {
    this.server.to(data.sessionId).emit('pauseSong', { currentTime: data.currentTime });
  }

  @SubscribeMessage('seekSong')
  async handleSeekSong(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; currentTime: number },
  ) {
    this.server.to(data.sessionId).emit('seekSong', { currentTime: data.currentTime });
  }

  @SubscribeMessage('syncTime')
  async handleSyncTime(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; currentTime: number },
  ) {
    this.server.to(data.sessionId).emit('syncTime', { currentTime: data.currentTime });
  }
} 