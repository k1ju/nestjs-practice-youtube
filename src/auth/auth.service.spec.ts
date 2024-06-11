import { Prisma } from '../prisma/prisma.service';
import { LoginDto } from './dto/LoginDto';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../auth/bcrypt.service';
import * as bcrypt from 'bcryptjs';

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
      id: 'example',
      pw: 'example',
    };

    const mockChannel = {
      idx: 1,
      id: 'example',
      pw: '$2a$12$77v45WXzaHSSLX/Vqt0Bz.ciGM.gmRE9eFhsB5./Pn6mnPeDZMpU.',
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

    expect(result).toEqual({ accessToken: 'mockedToken' });
    expect(findMock).toHaveBeenCalledTimes(1);
    expect(findMock).toHaveBeenCalledWith({ where: { id: loginDto.id } });
    expect(compareMock).toHaveBeenCalledWith(loginDto.pw, mockChannel.pw);
    expect(signMock).toHaveBeenCalledWith({ idx: mockChannel.idx });
  });

  // it('sign in', () => {
  //   let sum = 0;
  //   for (let i = 0; i < 10000000; i++) {
  //     sum += i;
  //   }

  //   expect(1).toBe(1);
  // });

  // it('sign in', () => {
  //   let sum = 0;
  //   for (let i = 0; i < 10000000; i++) {
  //     sum += i;
  //   }

  //   expect(1).toBe(1);
  // });

  // it('sign in', () => {
  //   let sum = 0;
  //   for (let i = 0; i < 10000000; i++) {
  //     sum += i;
  //   }

  //   expect(1).toBe(1);
  // });

  // it('sign in', () => {
  //   let sum = 0;
  //   for (let i = 0; i < 10000000; i++) {
  //     sum += i;
  //   }

  //   expect(1).toBe(1);
  // });

  // it('sign in', () => {
  //   let sum = 0;
  //   for (let i = 0; i < 10000000; i++) {
  //     sum += i;
  //   }

  //   expect(1).toBe(1);
  // });
});
