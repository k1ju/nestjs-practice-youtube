import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { Prisma } from 'src/prisma/prisma.service';
import { ChannelEntity } from './ChannelEntity';
import * as bcrypt from 'bcryptjs';

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

  getChannelCount: () => Promise<number>;

  getChannelAll: (page: number) => Promise<ChannelEntity[]>;

  getChannelByIdx: (idx: number) => Promise<ChannelEntity>;

  updateChannelByIdx: (idx: number, profileImgPath: string) => Promise<void>;
}

// Prisma에서 만들어주는 Model 타입은 Channel Video Suscribe
// 내가 직접 만들 엔티티 타입은 ChannelEntity

// 1. Prisma를 위한 Entity를 만들지 아니면 구조적 타이핑을 할지
// 2. Service 타입 정의를 먼저하면 좋다.
