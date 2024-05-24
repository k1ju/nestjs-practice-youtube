import { beforeEach } from 'node:test';
import { ChannelService } from './channel.service';
import { Test } from '@nestjs/testing';
import { Prisma } from '../prisma/prisma.service';
import { INestApplication } from '@nestjs/common';

describe('channelService', () => {
  let app: INestApplication;
  let channelService: ChannelService;
  let prisma: Prisma;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ChannelService, Prisma],
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);
    prisma = module.get<Prisma>(Prisma);
  });

  it('회원가입 테스트', async () => {
    const findMock = jest
      .spyOn(prisma.channel, 'findMany')
      .mockResolvedValue([]);

    const createMock = jest.spyOn(prisma.channel, 'create').mockRejectedValue({
      idx: 1,
      id: 'abc123',
      pw: 'asdfasdf',
      name: 'thisisname',
      profileImg: null,
      deletedAt: null,
      description: null,
      createdAt: new Date(),
    });

    await expect(
      channelService.signUp({
        id: 'abc123',
        pw: 'asdfasdf',
        name: 'thisisname',
      }),
    ).resolves.toBeUndefined();
    expect(findMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledTimes(1);
  });
});
