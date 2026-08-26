import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'firstname_1' })
  @IsString()
  @MinLength(2)
  firstname!: string;

  @ApiProperty({ example: 'lastname_1' })
  @IsString()
  @MinLength(2)
  lastname?: string;

  @ApiProperty({ example: 'user1@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'user1_password' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: false, default: false, required: false })
  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
}
