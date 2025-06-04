import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginInfoDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  sch_id: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  pass: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(4)
  captcha: string;
}
