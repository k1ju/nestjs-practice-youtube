import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { LoginUser } from './model/login-user.model';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): LoginUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
