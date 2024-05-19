import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { ChannelService } from './channel.service';
import { ChannelEntity } from './ChannelEntity';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { LoginUser } from 'src/auth/model/login-user.model';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    return this.channelService.signUp(signUpDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getMyInfo(@GetUser() loginUser: LoginUser) {
    return await this.channelService.getMyInfo(loginUser);
  }

  @Get('/all')
  async getChannelAll(@Query('page', ParseIntPipe) page: number): Promise<{
    channels: ChannelEntity[];
    count: number;
  }> {
    const channels = await this.channelService.getChannelAll(page);
    const count = await this.channelService.getChannelCount();

    return {
      channels,
      count,
    };
  }

  @Get('/:idx')
  async getChannelByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<ChannelEntity> {
    return await this.channelService.getChannelByIdx(idx);
  }
}
