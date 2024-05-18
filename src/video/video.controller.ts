import { Body, Controller, Post } from '@nestjs/common';
import { CreateVideoDto } from './dto/createVideoDto';

@Controller('video')
export class VideoController {
  //   constructor(private videoService: VideoService) {}

  @Post()
  createVideo(@Body() createVideoDto: CreateVideoDto) {}
}
