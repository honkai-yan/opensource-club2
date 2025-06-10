import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @MaxLength(20)
  sch_id: string;
}
