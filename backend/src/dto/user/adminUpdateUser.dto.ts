import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class AdminUpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  sch_id: string;

  @IsNotEmpty()
  @IsNumber()
  cur_point: number;

  @IsNotEmpty()
  @IsNumber()
  total_point: number;
}
