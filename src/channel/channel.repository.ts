import { Injectable } from '@nestjs/common';
import { Channel } from 'diagnostics_channel';
import { Prisma } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelRepository {
  constructor(private readonly prisma: Prisma) {}

  findOneByIdx: (idx: number) => Promise<Channel>;
}

// 1. Prisma 자체를 하나의 repository라고 생각한다.
// -장점: 코드가 편하다.
// -단점: ORM 종속성이 생김
// 2. Repository 자체를 또 만들어서 ORM종속성을 제거한다.
// -장점: 유연함
// -단점: 코드가 너무 많아짐 (추상화할게 너무 많음)
