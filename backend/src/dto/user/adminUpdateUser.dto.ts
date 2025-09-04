import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class AdminUpdateUserDto {
  @IsNotEmpty({ message: 'id不能为空' })
  @IsNumber({}, { message: 'id必须为数字' })
  id: number;

  @IsNotEmpty({ message: '姓名不能为空' })
  @IsString({ message: '姓名必须为字符串' })
  @MaxLength(255)
  name: string;

  @IsNotEmpty({ message: '学号不能为空' })
  @IsString({ message: '学号必须为字符串' })
  @MaxLength(20)
  sch_id: string;

  @IsNotEmpty({ message: '当前积分不能为空' })
  @IsNumber({}, { message: '当前积分必须为数字' })
  cur_point: number;

  @IsNotEmpty({ message: '总积分不能为空' })
  @IsNumber({}, { message: '总积分必须为数字' })
  total_point: number;
}
