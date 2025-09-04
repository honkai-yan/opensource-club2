import {
  IsDefined,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserProfileDto {
  @IsNotEmpty({ message: '用户昵称不能为空' })
  @IsString({ message: '用户昵称格式错误' })
  @MaxLength(20)
  nickname: string;

  @IsNotEmpty({ message: '用户描述不能为空' })
  @IsString({ message: '用户描述格式错误' })
  @MaxLength(255)
  description: string;

  constructor(nickname: string, description: string) {
    this.nickname = nickname;
    this.description = description;
  }
}
