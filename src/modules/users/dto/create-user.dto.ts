import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ada', description: 'User first name' })
  @IsString()
  @MinLength(2)
  firstname!: string;

  @ApiPropertyOptional({ example: 'Lovelace', description: 'User last name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastname?: string;

  @ApiProperty({
    example: 'ada@example.com',
    description: 'Unique email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'User password (min 8 characters)',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
