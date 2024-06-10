import { Prisma } from '../prisma/prisma.service';
import { LoginDto } from './dto/LoginDto';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BcryptService } from './bcrypt.service';

describe('auth service', () => {
  //로그인 테스트코드 작성

  let authService: AuthService;
  let jwtService: JwtService;
  let bcryptService: BcryptService;
  let prisma: Prisma;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, JwtService, Prisma, BcryptService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<Prisma>(Prisma);
    jwtService = module.get<JwtService>(JwtService);
    bcryptService = module.get<BcryptService>(BcryptService);
  });

  it('sign in', async () => {
    const loginDto: LoginDto = {
      id: 'aaa',
      pw: 'aA123!!!',
    };

    const mockChannel = {
      idx: 1,
      id: 'example',
      pw: 'example',
      name: 'name',
      description: 'example',
      profileImg: 'example',
      createdAt: new Date(),
      deletedAt: new Date(),
    };

    const findMock = jest
      .spyOn(prisma.channel, 'findFirst')
      .mockResolvedValue(mockChannel);

    const compareMock = jest
      .spyOn(bcryptService, 'compare')
      .mockResolvedValue(true);

    const signMock = jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValue('mockedToken');

    const result = await authService.signIn(loginDto);

    expect(result).resolves.toEqual({ accessToken: 'mockedToken' });
    expect(findMock).toHaveBeenCalledTimes(1);
    expect(findMock).toHaveBeenCalledWith({ where: { id: loginDto.id } });
    expect(compareMock).toHaveBeenCalledWith(loginDto.pw, mockChannel.pw);
    expect(signMock).toHaveBeenCalledWith({ idx: mockChannel.idx });
  });
});
