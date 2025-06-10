import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class DelUserDto {
  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  id: number;
}
