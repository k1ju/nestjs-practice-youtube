import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialDto } from './dto/AuthCredentialDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //로그인
  @Post()
  signIn(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto) {
    return this.authService.signIn(authCredentialDto);
  }
}
