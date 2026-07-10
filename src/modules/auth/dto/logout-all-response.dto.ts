import { ApiProperty } from '@nestjs/swagger';

export class LogoutAllResponseDto {
  @ApiProperty({
    example: 'Logged out from all devices successfully.',
  })
  message: string;
}