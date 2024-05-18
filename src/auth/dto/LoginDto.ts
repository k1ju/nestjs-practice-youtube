import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(1, 20)
  id: string;

  @IsString()
  @Length(8, 20)
  pw: string;
}
