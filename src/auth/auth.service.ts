import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user.toObject();
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user || typeof user.password !== 'string') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user._id);
    return this.generateJwt(user);
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      profile: {
        preferences: [],
      },
    });

    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user._id,
        role: user.role,
      }),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isProfileComplete: user.isProfileComplete,
      },
    };
  }

  async validateGoogleUser(profile: any) {
    const { email, given_name, family_name } = profile;

    try {
      const user = await this.usersService.findByEmail(email);
      return user;
    } catch (error) {
      // User doesn't exist, create new user
      const newUser = await this.usersService.create({
        email,
        firstName: given_name,
        lastName: family_name,
        googleId: profile.id,
        profile: {
          preferences: [],
        },
      });
      return newUser;
    }
  }

  generateJwt(user: User) {
    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user._id,
        role: user.role,
      }),
    };
  }
} 