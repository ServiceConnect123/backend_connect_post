import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetSelectedCompanyDto {
  @ApiProperty({
    description: 'ID de la compañía a seleccionar',
    example: '4525935d-0cb3-423f-8c1a-a74bb7a095bb',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  companyId: string;
}
