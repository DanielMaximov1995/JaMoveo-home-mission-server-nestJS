import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  instrument: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
} 