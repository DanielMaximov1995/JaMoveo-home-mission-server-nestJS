import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async createSession(adminId: string) {
    return this.prisma.session.create({
      data: {
        adminId,
        active: true,
      },
    });
  }

  async getSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async endSession(sessionId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { active: false },
    });
  }
} 