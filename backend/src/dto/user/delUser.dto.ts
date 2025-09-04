import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class DelUserDto {
  @IsNotEmpty({ message: 'id不能为空' })
  @IsNumber({}, { message: 'id必须为数字' })
  id: number;
}

export class DelUserBatchDto {
  @IsNotEmpty({ message: '用户列表不能为空' })
  @IsArray({ message: '用户列表必须为数组' })
  @IsNumber({}, { each: true })
  items: number[];
}
