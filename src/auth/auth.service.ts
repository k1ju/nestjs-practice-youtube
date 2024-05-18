import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialDto } from './dto/AuthCredentialDto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  async signIn(authCredentialDto: AuthCredentialDto) {
    const { id, pw } = authCredentialDto;
    const channel = await prisma.channel.findFirst({
      where: { id: id, pw: pw },
    });

    if (channel) {
      console.log('channel: ', channel);
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
