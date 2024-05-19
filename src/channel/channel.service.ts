import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { Prisma } from 'src/prisma/prisma.service';
import { ChannelEntity } from './ChannelEntity';
import * as bcrypt from 'bcryptjs';
import { LoginUser } from 'src/auth/model/login-user.model';
import { UpdateMyProfileImgDto } from './dto/updateMyProfileImgDto';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: Prisma) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const idDuplicatedChannel = await this.prisma.channel.findMany({
      where: { id: signUpDto.id },
    });

    if (idDuplicatedChannel.length > 0) {
      throw new ConflictException('id duplicated');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signUpDto.pw, salt);

    await this.prisma.channel.create({
      data: { id: signUpDto.id, pw: hashedPassword, name: signUpDto.name },
    });
  }

  async getMyInfo(loginUser: LoginUser): Promise<ChannelEntity> {
    const channelData = await this.prisma.channel.findUnique({
      where: { idx: loginUser.idx },
    });

    return new ChannelEntity(channelData);
  }

  async updateMyProfileImg(
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<{ profileImg: string }> {
    const channel = await this.prisma.channel.update({
      where: { idx: userIdx },
      data: {
        profileImg: file.path,
      },
    });

    return { profileImg: channel.profileImg };
  }

  async createSubscribe(userIdx: number, channelIdx: number): Promise<void> {
    await this.prisma.subscribe.create({
      data: { subscriber: userIdx, provider: channelIdx },
    });
  }

  async deleteSubscribe(userIdx: number, channelIdx: number): Promise<void> {
    await this.prisma.subscribe.deleteMany({
      where: { subscriber: userIdx, provider: channelIdx },
    });
  }

  async getMySubscribeAll(userIdx: number): Promise<any> {
    const providerList = await this.prisma.subscribe.findMany({
      where: {
        subscriber: userIdx,
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

  getChannelCount: () => Promise<number>;

  getChannelAll: (page: number) => Promise<ChannelEntity[]>;

  getChannelByIdx: (idx: number) => Promise<ChannelEntity>;

  updateChannelByIdx: (idx: number, profileImgPath: string) => Promise<void>;
}

// 2. Service 타입 정의를 먼저하면 좋다.
