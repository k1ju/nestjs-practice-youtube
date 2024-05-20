import { IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(1, 20)
  id: string;

  @IsString()
  @Length(8, 20)
  @IsStrongPassword({
    minLength: 8,
  })
  pw: string;

  @IsString()
  @Length(1, 10)
  name: string;
}
