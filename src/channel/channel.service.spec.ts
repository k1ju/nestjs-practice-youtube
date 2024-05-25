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

  it('signup', async () => {
    const findMock = jest
      .spyOn(prisma.channel, 'findMany')
      .mockResolvedValue([]);

    const createMock = jest.spyOn(prisma.channel, 'create').mockResolvedValue({
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
    ).resolves.toEqual({
      idx: 1,
      name: 'thisisname',
      description: null,
      profileImg: null,
      createdAt: new Date(),
    });
    expect(findMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it('getmyinfo test', async () => {
    const findMock = jest
      .spyOn(prisma.channel, 'findUnique')
      .mockResolvedValue({
        idx: 7,
        id: 'aaa4',
        pw: '$2a$10$VGvLOgH1YQJ6sAyI/FGDI.UyPsG9VlarLus0fYChtrnb0fei8CHSC',
        name: 'name',
        description: null,
        profileImg: '1716621275302.png',
        createdAt: new Date('2024-05-19 12:16:01'),
        deletedAt: null,
      });

    expect(channelService.getChannelByIdx(7)).resolves.toEqual({
      idx: 7,
      name: 'name',
      description: null,
      profileImg: '1716621275302.png',
      createdAt: new Date('2024-05-19T12:16:01'),
    });
    expect(findMock).toHaveBeenCalledTimes(1);
  });
});
