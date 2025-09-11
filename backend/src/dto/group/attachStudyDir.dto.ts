import { IsNotEmpty, IsNumber } from 'class-validator';

export class AttachStudyDirDto {
  @IsNotEmpty({ message: '小组id不能为空' })
  @IsNumber({}, { message: '小组id必须为数字' })
  groupId: number;

  @IsNotEmpty({ message: '学习方向不能为空' })
  @IsNumber({}, { message: '学习方向id必须为数字' })
  dir: number;
}
