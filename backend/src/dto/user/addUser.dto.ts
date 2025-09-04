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
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  sch_id: string;
}

export class AddUserBatchDto {
  @Type(() => AddUserDto)
  @IsArray()
  @ValidateNested({ each: true })
  items: AddUserDto[];
}
