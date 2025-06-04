import { Controller, Get, Put, Body, UseGuards, Request, Post, Delete, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole } from '../interfaces/user.interface';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the user profile' })
  async getProfile(@Request() req: RequestWithUser) {
    return this.usersService.findOne(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('avatar')
  @ApiOperation({ summary: 'Update user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Avatar updated successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Request() req: RequestWithUser,
    @UploadedFile() file: UploadedFileType,
  ) {
    return this.usersService.updateAvatar(req.user.id, file);
  }

  @Post('device-token')
  @ApiOperation({ summary: 'Register device token for push notifications' })
  @ApiResponse({ status: 201, description: 'Device token registered successfully' })
  async addDeviceToken(
    @Request() req: RequestWithUser,
    @Body('token') token: string,
  ) {
    await this.usersService.addDeviceToken(req.user.id, token);
    return { message: 'Device token registered successfully' };
  }

  @Delete('device-token/:token')
  @ApiOperation({ summary: 'Remove device token' })
  @ApiResponse({ status: 200, description: 'Device token removed successfully' })
  async removeDeviceToken(
    @Request() req: RequestWithUser,
    @Param('token') token: string,
  ) {
    await this.usersService.removeDeviceToken(req.user.id, token);
    return { message: 'Device token removed successfully' };
  }

  // Admin only endpoints
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  async getAllUsers() {
    // TODO: Implement getAllUsers method in UsersService
    return [];
  }
} 