import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Song } from './entities/song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}

  async findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  async findOne(id: string): Promise<Song> {
    const song = await this.songsRepository.findOne({
      where: { id },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    return song;
  }

  async search(query: string): Promise<Song[]> {
    return this.songsRepository.find({
      where: [
        { title: Like(`%${query}%`) },
        { artist: Like(`%${query}%`) },
      ],
    });
  }
} 