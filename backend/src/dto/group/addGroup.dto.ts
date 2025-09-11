import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddGroupDto {
  @IsNotEmpty({ message: '小组名称不能为空' })
  @IsString({ message: '小组名称必须为字符串' })
  name: string;

  @IsOptional()
  @IsString({ message: '小组描述必须为字符串' })
  description: string;

  @IsOptional()
  @IsNumber({}, { message: '小组学习方向必须为数字' })
  studyDirId: number;
}
