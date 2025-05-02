import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');
  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('register')
  handleRegister(client: Socket, payload: { username: string; password: string }) {
    // Here you would typically handle user registration
    // For now, we'll just acknowledge the registration attempt
    return { event: 'register_response', data: { success: true, message: 'Registration successful' } };
  }

  @SubscribeMessage('login')
  handleLogin(client: Socket, payload: { username: string; password: string }) {
    // Here you would typically handle user login
    // For now, we'll just acknowledge the login attempt
    return { event: 'login_response', data: { success: true, message: 'Login successful' } };
  }

  @SubscribeMessage('broadcast_song')
  handleBroadcastSong(client: Socket, payload: { songId: string; timestamp: number }) {
    // Broadcast the song to all connected clients except the sender
    client.broadcast.emit('song_broadcast', {
      songId: payload.songId,
      timestamp: payload.timestamp,
      broadcaster: client.id,
    });
    return { event: 'broadcast_response', data: { success: true } };
  }

  @SubscribeMessage('sync_song')
  handleSyncSong(client: Socket, payload: { songId: string; timestamp: number }) {
    // Handle song synchronization
    return { event: 'sync_response', data: { success: true, timestamp: payload.timestamp } };
  }
} 