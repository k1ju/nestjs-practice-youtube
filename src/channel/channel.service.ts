import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { Prisma } from '../prisma/prisma.service';
import { ChannelEntity } from './ChannelEntity';
import * as bcrypt from 'bcryptjs';
import { LoginUser } from '../auth/model/login-user.model';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: Prisma) {}

  async signUp(signUpDto: SignUpDto): Promise<ChannelEntity> {
    const idDuplicatedChannel = await this.prisma.channel.findMany({
      where: { id: signUpDto.id },
    });

    if (idDuplicatedChannel.length > 0) {
      throw new ConflictException('id duplicated');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.pw, 15);

    const channelData = await this.prisma.channel.create({
      data: { id: signUpDto.id, pw: hashedPassword, name: signUpDto.name },
    });

    return new ChannelEntity(channelData);
  }

  async updateMyProfileImg(
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<{ profileImg: string }> {
    let channel = await this.getChannelByIdx(userIdx);

    if (!channel) {
      throw new NotFoundException('Not Found ProfileImg');
    }

    const channelData = await this.prisma.channel.update({
      where: { idx: userIdx },
      data: {
        profileImg: file.filename,
      },
    });

    return { profileImg: channelData.profileImg };
  }

  async createSubscribe(userIdx: number, channelIdx: number): Promise<void> {
    await this.prisma.subscribe.create({
      data: { subscriber: userIdx, provider: channelIdx },
    });
  }

  async deleteSubscribeByIdx(
    userIdx: number,
    channelIdx: number,
  ): Promise<void> {
    await this.prisma.subscribe.deleteMany({
      where: { subscriber: userIdx, provider: channelIdx },
    });
  }

  async getSubscribeAll(channelIdx: number): Promise<ChannelEntity[]> {
    const providerList = await this.prisma.subscribe.findMany({
      where: {
        subscriber: channelIdx,
      },
    });

    const channelList = await this.prisma.channel.findMany({
      where: {
        idx: {
          in: providerList.map((elem) => elem.provider),
        },
      },
    });

    return channelList.map((elem) => new ChannelEntity(elem));
  }

  async getChannelByIdx(channelIdx: number): Promise<ChannelEntity> {
    const channelData = await this.prisma.channel.findUnique({
      where: { idx: channelIdx },
    });

    if (!channelData) {
      throw new NotFoundException('Not Found Video');
    }

    console.log(new ChannelEntity(channelData));

    return new ChannelEntity(channelData);
  }

  async getSubscrbeState(
    subscriberIdx: number,
    providerIdx: number,
  ): Promise<boolean> {
    const subscribeState = await this.prisma.subscribe.findUnique({
      where: {
        subscriber_provider: {
          subscriber: subscriberIdx,
          provider: providerIdx,
        },
      },
    });

    if (!subscribeState) {
      return false;
    }

    return true;
  }
}
