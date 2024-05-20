import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class VideoPagerbleDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  channel?: number;
}
