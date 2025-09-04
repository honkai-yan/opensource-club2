import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginInfoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  sch_id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  pass: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(4)
  captcha: string;
}
