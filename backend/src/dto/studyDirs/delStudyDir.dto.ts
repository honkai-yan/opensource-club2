import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class DelStudyDirDto {
  @IsNotEmpty({ message: 'studyId不能为空' })
  @IsArray({ message: 'studyId不能为空' })
  @ArrayNotEmpty({ message: 'studyId不能为空数组' })
  @IsNumber({}, { each: true, message: 'studyId必须是数字' })
  id: number[];
}
