import { IsNotEmpty, IsNumber } from 'class-validator';

export class DelGroupDto {
  @IsNotEmpty({ message: '小组id不能为空' })
  @IsNumber({}, { message: '小组id必须为数字' })
  groupId: number;
}
