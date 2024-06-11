import { BcryptService } from './bcrypt.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import { Prisma } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: Prisma,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const channel = await this.prisma.channel.findFirst({
      where: { id: loginDto.id },
    });

    if (!channel) {
      throw new UnauthorizedException('login failed');
    }

    if (!(await this.bcryptService.compare(loginDto.pw, channel.pw))) {
      throw new UnauthorizedException('login failed');
    }

    const accessToken = await this.jwtService.signAsync({ idx: channel.idx });
    return { accessToken: accessToken };
  }
}
