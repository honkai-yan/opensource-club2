import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class GroupAddUserDto {
  @IsNotEmpty({ message: '小组id不能为空' })
  @IsNumber({}, { message: '小组id必须为数字' })
  groupId: number;

  @IsNotEmpty({ message: '用户id列表不能为空' })
  @IsArray({ message: '用户id列表必须为数组' })
  @ArrayNotEmpty({ message: '用户id列表不能为空' })
  @IsNumber({}, { each: true })
  users: number[];
}
