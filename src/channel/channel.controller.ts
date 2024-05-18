import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { ChannelService } from './channel.service';
import { ChannelEntity } from './ChannelEntity';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    return this.channelService.signUp(signUpDto);
  }

  @Get()
  getMyInfo() {}

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
