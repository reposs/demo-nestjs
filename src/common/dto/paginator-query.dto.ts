import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginatorQueryDto {
  @ApiPropertyOptional({
    example: 0,
    default: 0,
    minimum: 0,
    description: 'Number of items to skip',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip: number = 0;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    description: 'Maximum number of items to return (max: 100)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;
}
