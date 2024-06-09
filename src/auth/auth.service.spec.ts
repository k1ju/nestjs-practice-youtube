import { Prisma } from '../prisma/prisma.service';
import { LoginDto } from './dto/LoginDto';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('auth service', () => {
  //로그인 테스트코드 작성

  let authService: AuthService;
  let jwtService: JwtService;
  let prisma: Prisma;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, JwtService, Prisma],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<Prisma>(Prisma);
    jwtService = module.get<JwtService>(JwtService);
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

    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    const signMock = jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValue('mockedToken');

    const result = await authService.signIn(loginDto);

    expect(result).resolves.toEqual({ accessToken: 'mockedToken' });
    expect(findMock).toHaveBeenCalledTimes(1);
    expect(findMock).toHaveBeenCalledWith({ where: { id: loginDto.id } });
    expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.pw, mockChannel.pw);
    expect(signMock).toHaveBeenCalledWith({ idx: mockChannel.idx });
  });
});
