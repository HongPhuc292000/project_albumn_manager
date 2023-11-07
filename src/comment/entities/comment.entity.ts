import { CustomBaseEntity } from 'src/common/entities/base.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Comment extends CustomBaseEntity {
  @Column({ length: 1000, nullable: false })
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Photo, (photo) => photo.comments)
  photo: Photo;

  status: never;
}
