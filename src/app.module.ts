import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { ChannelModule } from './channel/channel.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    VideoModule,
    ChannelModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'media'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
