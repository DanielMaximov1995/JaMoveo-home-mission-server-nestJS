import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SongsService {
  constructor(private prisma: PrismaService) {}

  async search(query: string) {
    return this.prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { artist: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        artist: true,
        imageUrl: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.song.findUnique({
      where: { id },
    });
  }
} 