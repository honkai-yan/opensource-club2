import {
  IsDefined,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  constructor(nickname: string, description: string) {
    this.nickname = nickname;
    this.description = description;
  }
}
