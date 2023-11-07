import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from 'src/photo/entities/photo.entity';
import { ResponseData } from 'src/types';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
  ) {}
  async create(createCommentDto: CreateCommentDto, userId: string) {
    const { content, photoId } = createCommentDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    const photo = await this.photoRepository.findOneBy({ id: photoId });

    if (!photo) {
      throw new HttpException('not found photo', HttpStatus.BAD_REQUEST);
    }

    const newComment = this.commentRepository.create({ content });
    newComment.user = user;
    newComment.photo = photo;

    const savedComment = await this.commentRepository.save(newComment);

    return new ResponseData(savedComment.id, HttpStatus.CREATED, 'ok');
  }
}
