import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier (UUID)',
  })
  id!: string;

  @ApiProperty({ example: 'Ada', description: 'User first name' })
  firstname!: string;

  @ApiPropertyOptional({ example: 'Lovelace', description: 'User last name' })
  lastname?: string;

  @ApiProperty({ example: 'ada@example.com', description: 'Unique user email' })
  email!: string;

  @ApiProperty({
    example: false,
    description: 'Whether the user account is disabled',
  })
  disabled!: boolean;

  @ApiProperty({
    example: '2026-10-10T00:00:00.000Z',
    description: 'Account creation date',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-10-10T00:00:00.000Z',
    description: 'Last account update date',
  })
  updatedAt!: Date;
}
