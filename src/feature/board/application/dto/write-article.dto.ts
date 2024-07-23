import { ApiProperty } from '@nestjs/swagger';

export class WriteArticleDto {

  @ApiProperty()
  id!: number;

}
