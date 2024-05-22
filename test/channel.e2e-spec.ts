import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelService } from 'src/channel/channel.service';
import { INestApplication } from '@nestjs/common';
import { SignUpDto } from 'src/channel/dto/SignUpDto';

describe('Channel (e2e)', () => {
  let app: INestApplication;
  let channelService = {
    signUp: () => ['test'],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ChannelModule],
    })
      .overrideProvider(ChannelService)
      .useValue(channelService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/POST signup', () => {
    const signUpDto: SignUpDto = {
      id: 'testID',
      pw: 'testPW',
      name: 'name',
    };

    return request(app.getHttpServer())
      .post('/signup')
      .send(signUpDto)
      .expect(201)
      .expect({
        data: channelService.signUp(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
