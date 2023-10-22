import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParamsWithId {
  @IsMongoId()
  @ApiProperty({ description: 'recipe id' })
  id: string;
}
