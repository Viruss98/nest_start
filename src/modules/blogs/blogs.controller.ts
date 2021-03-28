import { Controller, Get, Param, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlogsService } from './services/blogs.service';
import { AudioService } from './services/audio.service';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService, private readonly audioService: AudioService) {}

  @Get()
  @UseGuards(AuthGuard('local'))
  find(@Param() params: { limit: number }) {
    return this.blogService.pagination(params);
  }

  @Post('transcode')
  async transcode() {
    await this.audioService.addJob();
  }
}
