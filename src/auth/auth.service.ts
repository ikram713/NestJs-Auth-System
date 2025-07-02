import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel('RefreshToken') private RefreshTokenModel: Model<any>,
    private jwtService: JwtService,
  ) {}

  async signUp(signupData: SignupDto) {
    const { name, email, password } = signupData;

    // Check if email is already in use
    const emailInUse = await this.UserModel.findOne({ email });
    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user in MongoDB
    await this.UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      message: 'User created successfully',
      user: {
        name,
        email,
      },
    };
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare provided password with stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const tokens = await this.genrateUserTokens(user._id);

    return {
      tokens,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }



  async genrateUserTokens(userId) {
    const accessToken = await this.jwtService.sign(
      { userId },
      { expiresIn: '1h' },
    );

    const RefreshToken = uuid4();
    await this.storeRefreshToken(RefreshToken, userId);

    return {
      accessToken,
      RefreshToken,
    };
  }


    
  async storeRefreshToken(refreshToken: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getDate() + 3); // Set expiry to

    await this.RefreshTokenModel.create({
      token: refreshToken,
      userId,
     expiryDate: expiryDate,
    });
  }
}
