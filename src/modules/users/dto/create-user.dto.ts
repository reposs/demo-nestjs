import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'firstname_1' })
  @IsString()
  @MinLength(2)
  firstname!: string;

  @ApiProperty({ example: 'lastname_1' })
  @IsString()
  @MinLength(2)
  lastname?: string;

  @ApiProperty({ example: 'email_1@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password_1' })
  @IsString()
  @MinLength(8)
  password!: string;
}
