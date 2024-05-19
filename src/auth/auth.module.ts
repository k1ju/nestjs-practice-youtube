import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
  imports: [
    PrismaModule,
    // 1. 환경변수는 ConfigModule을 통해서 가져와야한다.
    // 2. JwtModule을 등록할 떄는 환경변수에 있는 secret을 가져와야한다.
    // 3. JwtModule을 등록할 때 ConfigModule을 주입받아 사용해야한다.
    // JwtModule.registerAsync({
    //   imports: [ConfigModule.forFeature(jwtConfig)],
    //   inject: [ConfigService],

    //   useFactory: (configService: ConfigService) => {
    //     const jwtConfig = configService.get('jwtConfig'); // { secret: 'stageus123' }

    //     return jwtConfig;
    //   },
    // }),
    JwtModule.register({
      secret: 'stageus123',
    }),
    ChannelModule,
  ],
  // 모듈 등록할 때 ConfigModule을 등록하여 환경변수 값을 사용하기
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

// 정적 모듈
// 동적 모듈
// 1. forRoot / forFeature : 그 하위 모든 모듈에서 사용가능 / 자기 모듈에만
// 2. register / registerSync : 비동기적으로 등록할 것이냐 / 동기적으로 등록할 것이냐
