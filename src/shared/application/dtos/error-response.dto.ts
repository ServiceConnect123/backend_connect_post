import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message or array of error messages',
    oneOf: [
      { type: 'string', example: 'Invalid credentials' },
      { type: 'array', items: { type: 'string' }, example: ['email must be a valid email', 'password is too short'] }
    ],
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error type or path',
    example: 'Bad Request',
  })
  error: string;
}

export class UnauthorizedErrorDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string;
}

export class ForbiddenErrorDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 403,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Forbidden resource',
  })
  message: string;
}

export class NotFoundErrorDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Resource not found',
  })
  message: string;
}
