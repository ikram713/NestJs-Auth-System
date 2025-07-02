import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto'; // ✅ Fix: Import LoginDto

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials); // ✅ Fix: change Login → login
  }
}
