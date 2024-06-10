import { ChannelService } from './channel.service';
import { Test } from '@nestjs/testing';
import { Prisma } from '../prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/SignUpDto';
import { BcryptService } from 'src/auth/bcrypt.service';

describe('channelService', () => {
  let app: INestApplication;
  let channelService: ChannelService;
  let bcryptService: BcryptService;
  let prisma: Prisma;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ChannelService, Prisma],
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);
    prisma = module.get<Prisma>(Prisma);
    bcryptService = module.get<BcryptService>(BcryptService);

    jest.useFakeTimers().setSystemTime(new Date('2024-05-05'));
  });

  afterAll(async () => {
    jest.useRealTimers();
  });

  it('signup test', async () => {
    const signUpDto: SignUpDto = {
      id: 'abc123',
      pw: 'asdfasdf',
      name: 'thisisname',
    };

    const mockChannel = {
      idx: 1,
      id: 'abc123',
      pw: 'asdfasdf',
      name: 'thisisname',
      profileImg: null,
      deletedAt: null,
      description: null,
      createdAt: new Date(),
    };

    const findMock = jest
      .spyOn(prisma.channel, 'findMany')
      .mockResolvedValue([]);

    // 비크립트와 같이 외부라이브러리 함수를 테스트 코드에서 이용할때, 별도의 서비스 클래스로 만든뒤에 주입받아서 사용한다
    // 그래야지 원본 함수를 건드리지않고, 별도의 객체내의 함수로 만들어서 모킹할 수 있다.
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('mockHashedPw'));

    const createMock = jest
      .spyOn(prisma.channel, 'create')
      .mockResolvedValue(mockChannel);

    const result = await channelService.signUp(signUpDto);

    await expect(result).resolves.toEqual(mockChannel);
    expect(findMock).toHaveBeenCalledTimes(1);
    expect(findMock).toHaveBeenCalledWith({
      where: { id: signUpDto.id },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.pw, 7);
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      data: { id: signUpDto.id, pw: 'mockHashedPw', name: signUpDto.name },
    });
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
        createdAt: new Date(),
        deletedAt: null,
      });

    expect(channelService.getChannelByIdx(7)).resolves.toEqual({
      idx: 7,
      name: 'name',
      description: null,
      profileImg: '1716621275302.png',
      createdAt: new Date(),
    });
    expect(findMock).toHaveBeenCalledTimes(1);
  });

  it('change profile-img test', async () => {
    const userIdx = 1;
    const file = { filename: 'testImg.png' } as Express.Multer.File;

    jest.spyOn(channelService, 'getChannelByIdx').mockResolvedValue({
      idx: 1,
      name: 'name',
      description: null,
      profileImg: '1716621275302.png',
      createdAt: new Date(),
    });

    jest.spyOn(prisma.channel, 'update').mockResolvedValue({
      idx: 1,
      id: 'aaa4',
      pw: '$2a$10$VGvLOgH1YQJ6sAyI/FGDI.UyPsG9VlarLus0fYChtrnb0fei8CHSC',
      name: 'name',
      description: null,
      profileImg: file.filename,
      createdAt: new Date(),
      deletedAt: null,
    });

    await expect(
      channelService.updateMyProfileImg(userIdx, file),
    ).resolves.toEqual({
      profileImg: 'testImg.png',
    });
    expect(prisma.channel.update).toHaveBeenCalledWith({
      where: { idx: userIdx },
      data: { profileImg: file.filename },
    });
    expect(channelService.getChannelByIdx).toHaveBeenCalledWith(userIdx);
  });

  it('subscribe test', async () => {
    //구독중이지않은관계를 직접찾아서 넣어야하는가?
    const userIdx = 6;
    const channelIdx = 7;

    const findMock = jest
      .spyOn(channelService, 'getSubscrbeState')
      .mockResolvedValue(false);

    //반환값이 없는 함수도 mock를 해줘야하는가?
    const createMock = jest
      .spyOn(prisma.subscribe, 'create')
      .mockResolvedValue(undefined);

    await expect(channelService.createSubscribe(userIdx, channelIdx)).resolves
      .not.toThrow;

    expect(findMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      data: { subscriber: 6, provider: 7 },
    });
  });
});
