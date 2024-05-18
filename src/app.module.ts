import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [AuthModule, VideoModule, ChannelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
