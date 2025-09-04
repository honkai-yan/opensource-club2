import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须为字符串' })
  @MaxLength(255)
  name: string;

  @IsNotEmpty({ message: '用户密码不能为空' })
  @IsString({ message: '用户密码必须为字符串' })
  @MaxLength(20)
  sch_id: string;
}

export class AddUserBatchDto {
  @Type(() => AddUserDto)
  @IsArray()
  @ValidateNested({ each: true })
  items: AddUserDto[];
}
