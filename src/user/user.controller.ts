import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SelfGuard } from 'src/auth/guard/self.guard';
import { User } from 'src/decorators';
import { JWTPayload } from 'src/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(SelfGuard)
  getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getProfile(id);
  }

  @Patch(':id')
  @UseGuards(SelfGuard)
  updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  @Patch('follow/:id')
  follow(@Param('id', ParseUUIDPipe) id: string, @User() user: JWTPayload) {
    return this.userService.follow(id, user.sub);
  }

  @Patch('join-albumn/:id')
  joinAlbumn(@Param('id', ParseUUIDPipe) id: string, @User() user: JWTPayload) {
    return this.userService.joinAlbumn(id, user.sub);
  }
}
