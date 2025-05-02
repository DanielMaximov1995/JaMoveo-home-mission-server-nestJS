import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { SongsService } from '../songs/songs.service';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    private songsService: SongsService,
  ) {}

  async createSession(adminId: string): Promise<Session> {
    const session = this.sessionsRepository.create({
      adminId,
    });
    return this.sessionsRepository.save(session);
  }

  async getSession(sessionId: string): Promise<Session> {
    const session = await this.sessionsRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async updateSession(sessionId: string, songId: string): Promise<Session> {
    const session = await this.getSession(sessionId);
    session.songId = songId;
    return this.sessionsRepository.save(session);
  }

  async endSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    session.ended = true;
    await this.sessionsRepository.save(session);
  }

  async getCurrentSong(sessionId: string) {
    const session = await this.getSession(sessionId);
    if (!session.songId) {
      return null;
    }
    return this.songsService.findOne(session.songId);
  }
} 