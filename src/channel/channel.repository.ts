import { Injectable } from '@nestjs/common';
import { Channel } from 'diagnostics_channel';
import { Prisma } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelRepository {
  constructor(private readonly prisma: Prisma) {}

  findOneByIdx: (idx: number) => Promise<Channel>;
}
