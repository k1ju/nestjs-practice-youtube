import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(1, 20)
  @ApiProperty({
    example: 'testid',
    description: '1-20자',
  })
  id: string;

  @IsString()
  @Length(8, 20)
  @IsStrongPassword({
    minLength: 8,
  })
  @ApiProperty({
    example: 'testpw',
    description: '8-20자',
  })
  pw: string;

  @IsString()
  @Length(1, 10)
  @ApiProperty({
    example: 'testname',
    description: '1-10자',
  })
  name: string;
}
