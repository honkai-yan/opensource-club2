import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class AddStudyDirItemDto {
  @IsNotEmpty({ message: 'leader_id不能为空' })
  @IsNumber({}, { message: 'leader_id必须为数字' })
  leader_id: number;

  @IsNotEmpty({ message: 'name不能为空' })
  @IsString({ message: 'name必须为字符串' })
  @MaxLength(255)
  name: string;
}

export class AddStudyDirDto {
  @IsNotEmpty({ message: '学习方向数组不能为空' })
  @IsArray({ message: 'items必须为数组' })
  @ValidateNested({ each: true })
  @Type(() => AddStudyDirItemDto)
  items: AddStudyDirItemDto[];
}
