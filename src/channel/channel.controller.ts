import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { ChannelService } from './channel.service';
import { ChannelEntity } from './ChannelEntity';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { LoginUser } from 'src/auth/model/login-user.model';
import { UpdateMyProfileImgDto } from './dto/updateMyProfileImgDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerOptions } from 'src/configs/multerOption';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  //회원가입
  @Post()
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    return this.channelService.signUp(signUpDto);
  }

  //내정보보기
  @Get()
  @UseGuards(AuthGuard)
  async getMyInfo(@GetUser() loginUser: LoginUser) {
    return await this.channelService.getMyInfo(loginUser);
  }

  //프로필이미지 수정하기
  @Put('/profile-img')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateMyProfileImg(
    @GetUser() loginUser: LoginUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ profileImg: string }> {
    return await this.channelService.updateMyProfileImg(loginUser.idx, file);
  }

  //구독하기
  @Post(':channelIdx/subscribe')
  @UseGuards(AuthGuard)
  async createSubscribe(
    @GetUser() loginUser: LoginUser,
    @Param('channelIdx', ParseIntPipe) channelIdx: number,
  ): Promise<void> {
    return await this.channelService.createSubscribe(loginUser.idx, channelIdx);
  }

  //구독취소하기
  @Delete(':channelIdx/subscribe')
  @UseGuards(AuthGuard)
  async deleteSubscribe(
    @GetUser() loginUser: LoginUser,
    @Param('channelIdx', ParseIntPipe) channelIdx: number,
  ): Promise<void> {
    await this.channelService.deleteSubscribe(loginUser.idx, channelIdx);
  }

  //내구독목록 보기
  @Get(':channelIdx/subscribe/all')
  @UseGuards(AuthGuard)
  async getMySubscribeAll(
    @GetUser() loginUser: LoginUser,
  ): Promise<ChannelEntity[]> {
    return this.channelService.getSubscribeAll(loginUser.idx);
  }

  //채널상세보기
  @Get(':channelIdx')
  @UseGuards(AuthGuard)
  async getChannelInfo(
    @Param('channelIdx', ParseIntPipe) channelIdx: number,
  ): Promise<ChannelEntity> {
    return this.channelService.getChannelByIdx(channelIdx);
  }
}
