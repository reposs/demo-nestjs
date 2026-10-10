import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Health status' })
  status!: string;

  @ApiProperty({
    example: '2026-10-10T00:00:00.000Z',
    description: 'Current ISO server timestamp',
  })
  timestamp!: string;

  @ApiProperty({
    example: 120.45,
    description: 'Process uptime in seconds',
  })
  uptime!: number;
}
