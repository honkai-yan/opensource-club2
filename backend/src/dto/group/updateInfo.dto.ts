import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class UpdateGroupInfoDto {
  @IsNotEmpty({ message: '小组id不能为空' })
  @IsNumber({}, { message: '小组id必须是数字' })
  id: number;

  @IsNotEmpty({ message: '小组名称不能为空' })
  @IsString({ message: '小组名称必须是字符串' })
  @MaxLength(20)
  name: string;

  @IsNotEmpty({ message: '小组描述不能为空' })
  @IsString({ message: '小组描述必须是字符串' })
  @MaxLength(255)
  description: string;
}
