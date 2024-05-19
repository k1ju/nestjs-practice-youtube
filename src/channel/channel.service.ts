import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { Prisma } from 'src/prisma/prisma.service';
import { ChannelEntity } from './ChannelEntity';
import * as bcrypt from 'bcryptjs';
import { LoginUser } from 'src/auth/model/login-user.model';
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: Prisma) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
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

  getChannelCount: () => Promise<number>;

  getChannelAll: (page: number) => Promise<ChannelEntity[]>;

  getChannelByIdx: (idx: number) => Promise<ChannelEntity>;

  updateChannelByIdx: (idx: number, profileImgPath: string) => Promise<void>;
}

// 2. Service 타입 정의를 먼저하면 좋다.
