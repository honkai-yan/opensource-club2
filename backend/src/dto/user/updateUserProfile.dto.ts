import {
  IsDefined,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserProfileDto {
  @IsDefined()
  @MaxLength(20)
  @IsString()
  nickname: string;

  @IsDefined()
  @MaxLength(255)
  @IsString()
  description: string;

  constructor(nickname: string, description: string) {
    this.nickname = nickname;
    this.description = description;
  }
}
