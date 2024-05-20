import { IsInt, IsNotEmpty, Length } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @Length(2, 20)
  title: string;

  @IsNotEmpty()
  @Length(2, 2000)
  content: string;
}
