import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/createVideoDto';
import { VideoService } from './video.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/configs/multerOption';
import { GetUser } from 'src/auth/get-user.decorator';
import { LoginUser } from 'src/auth/model/login-user.model';
import { VideoEntity } from './VideoEntity';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  createVideo(
    @GetUser() loginUser: LoginUser,
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<VideoEntity> {
    if (!file) {
      throw new BadRequestException('No image file');
    }

    return this.videoService.createVideo(loginUser.idx, createVideoDto, file);
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  getVideoAll(
    @Query('channelidx', ParseIntPipe) channelIdx: number,
  ): Promise<VideoEntity[]> {
    return this.videoService.getVideoAll(channelIdx);
  }
}
