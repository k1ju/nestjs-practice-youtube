import { IsNotEmpty } from 'class-validator';

export class UpdateMyProfileImgDto {
  @IsNotEmpty()
  profileImg: string;
}
