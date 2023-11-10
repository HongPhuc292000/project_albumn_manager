import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { User } from 'src/decorators';
import { CommonQuery, JWTPayload } from 'src/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('feed')
  getNewFeed(@User() user: JWTPayload, @Query() query: CommonQuery) {
    return this.userService.getNewFeed(user.sub, query);
  }

  @Get(':id')
  getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getProfile(id);
  }

  @Patch(':id')
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
