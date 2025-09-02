import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class DelUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class DelUserBatchDto {
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  items: number[];
}
