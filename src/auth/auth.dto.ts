import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@superlearn.ing' })
  email!: string;

  @ApiProperty({ example: 'strongPassword123' })
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@superlearn.ing' })
  email!: string;

  @ApiProperty({ example: 'strongPassword123' })
  password!: string;
}
