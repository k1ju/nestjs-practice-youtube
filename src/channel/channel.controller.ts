import {
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
import { FileInterceptor } from '@nestjs/platform-express';
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
  getMyInfo(@GetUser() loginUser: LoginUser) {
    return this.channelService.getMyInfo(loginUser);
  }

  //프로필이미지 수정하기
  @Put('/profile-img')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updateMyProfileImg(
    @GetUser() loginUser: LoginUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ profileImg: string }> {
    return this.channelService.updateMyProfileImg(loginUser.idx, file);
  }

  //구독하기
  @Post(':channelIdx/subscribe')
  @UseGuards(AuthGuard)
  createSubscribe(
    @GetUser() loginUser: LoginUser,
    @Param('channelIdx', ParseIntPipe) channelIdx: number,
  ): Promise<void> {
    return this.channelService.createSubscribe(loginUser.idx, channelIdx);
  }

  //구독취소하기
  @Delete(':channelIdx/subscribe')
  @UseGuards(AuthGuard)
  deleteSubscribe(
    @GetUser() loginUser: LoginUser,
    @Param('channelIdx', ParseIntPipe) channelIdx: number,
  ): Promise<void> {
    return this.channelService.deleteSubscribe(loginUser.idx, channelIdx);
  }

  //내구독목록 보기
  @Get(':channelIdx/subscribe/all')
  @UseGuards(AuthGuard)
  getMySubscribeAll(@GetUser() loginUser: LoginUser): Promise<ChannelEntity[]> {
    return this.channelService.getSubscribeAll(loginUser.idx);
  }

  //채널상세보기
  @Get(':channelIdx')
  @UseGuards(AuthGuard)
  getChannelInfo(
    @Param('channelIdx', ParseIntPipe) channelIdx: number,
  ): Promise<ChannelEntity> {
    return this.channelService.getChannelByIdx(channelIdx);
  }
}
