import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    username: string;
    isAdmin: boolean;
  };
}

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post()
  async createSession(@Req() req: RequestWithUser) {
    return this.sessionsService.createSession(req.user.id);
  }

  @Get(':id')
  async getSession(@Param('id') id: string) {
    return this.sessionsService.getSession(id);
  }

  @Post(':id/end')
  async endSession(@Param('id') id: string) {
    return this.sessionsService.endSession(id);
  }
} 