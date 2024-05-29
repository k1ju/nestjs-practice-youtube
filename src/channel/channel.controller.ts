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
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/configs/multerOption';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  //회원가입
  @Post()
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({ description: 'created id' })
  @ApiConflictResponse({ description: 'id duplicate' })
  async signUp(
    @Body(ValidationPipe) signUpDto: SignUpDto,
  ): Promise<ChannelEntity> {
    return await this.channelService.signUp(signUpDto);
  }

  //내정보보기
  @Get()
  @ApiOperation({ summary: 'get myinfo' })
  @ApiOkResponse({ description: 'ok' })
  @ApiNotFoundResponse({ status: 404, description: ' not found idx' })
  @UseGuards(AuthGuard)
  async getMyInfo(@GetUser() loginUser: LoginUser) {
    return await this.channelService.getChannelByIdx(loginUser.idx);
  }

  //프로필이미지 수정하기
  @Put('/profile-img')
  @ApiOperation({ summary: 'change profileImg' })
  @ApiBadRequestResponse({ description: 'no image file' })
  @ApiNotFoundResponse({ description: 'not found profileImg' })
  @ApiOkResponse({ description: 'ok', type: 'cat' })
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateMyProfileImg(
    @GetUser() loginUser: LoginUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ profileImg: string }> {
    if (!file) {
      throw new BadRequestException('No image file');
    }
    return await this.channelService.updateMyProfileImg(loginUser.idx, file);
  }

  //구독하기
  @Post(':channelIdx/subscribe')
  @ApiOperation({ summary: 'subscribe' })
  @ApiParam({ name: 'channelIdx' })
  @ApiBadRequestResponse({ description: 'no channelIdx' })
  @ApiConflictResponse({ description: 'already subscribe' })
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async createSubscribe(
    @GetUser() loginUser: LoginUser,
    @Param('channelIdx', ParseIntPipe) channelIdx: number,
  ): Promise<void> {
    return await this.channelService.createSubscribe(loginUser.idx, channelIdx);
  }

  //구독취소하기
  @Delete(':channelIdx/subscribe')
  @ApiOperation({ summary: 'delete subscribe' })
  @ApiParam({ name: 'channelIdx' })
  @ApiBadRequestResponse({ description: 'no channelIdx' })
  @ApiConflictResponse({ description: 'already not subscribe' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(AuthGuard)
  async deleteSubscribe(
    @GetUser() loginUser: LoginUser,
    @Param('channelIdx', ParseIntPipe) channelIdx: number,
  ): Promise<void> {
    return await this.channelService.deleteSubscribeByIdx(
      loginUser.idx,
      channelIdx,
    );
  }

  //내구독목록 보기
  @Get(':channelIdx/subscribe/all')
  @ApiOperation({ summary: 'get all my subscribe list' })
  @ApiParam({ name: 'channelIdx' })
  @ApiBadRequestResponse({ description: 'no channelIdx' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(AuthGuard)
  async getMySubscribeAll(
    @GetUser() loginUser: LoginUser,
  ): Promise<ChannelEntity[]> {
    return await this.channelService.getSubscribeAll(loginUser.idx);
  }

  //채널상세보기
  @Get(':channelIdx')
  @ApiOperation({ summary: 'get channel in detail' })
  @ApiParam({ name: 'channelIdx' })
  @ApiBadRequestResponse({ description: 'no channelIdx' })
  @ApiNotFoundResponse({ description: 'not found channel' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(AuthGuard)
  async getChannelInfo(
    @GetUser() loginUser: LoginUser,
    @Param('channelIdx', ParseIntPipe) channelIdx: number,
  ): Promise<{
    channel: ChannelEntity;
    subscribe: boolean;
  }> {
    const subscribeState = await this.channelService.getSubscrbeState(
      loginUser.idx,
      channelIdx,
    );
    const channel = await this.channelService.getChannelByIdx(channelIdx);

    return {
      channel,
      subscribe: subscribeState,
    };
  }
}
