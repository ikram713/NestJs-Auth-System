import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  password: string;
}
