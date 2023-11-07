import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/decorators';
import { JWTPayload } from 'src/types';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: JWTPayload) {
    return this.commentService.create(createCommentDto, user.sub);
  }
}
