import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginInfoDto {
  @IsNotEmpty({ message: '学号不能为空' })
  @IsString({ message: '学号格式错误' })
  @MaxLength(20)
  sch_id: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码格式错误' })
  @MaxLength(255)
  pass: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码格式错误' })
  @MaxLength(4)
  captcha: string;
}
