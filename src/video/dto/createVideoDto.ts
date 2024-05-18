import { IsNotEmpty, isNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  channel_idx: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  thumbnail_img: string;
}
