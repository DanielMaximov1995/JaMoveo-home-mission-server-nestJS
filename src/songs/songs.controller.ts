import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('songs')
@UseGuards(JwtAuthGuard)
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    return this.songsService.search(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }
} 