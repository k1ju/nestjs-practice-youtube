import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class Prisma extends PrismaClient implements OnModuleInit {
  // 주입을 하는 시점에서 PostgreSQL에 connect한다.
  async onModuleInit() {
    await this.$connect();
  }
}
