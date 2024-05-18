import { IsString, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(1)
  id: string;

  @IsString()
  @MinLength(1)
  pw: string;
}
