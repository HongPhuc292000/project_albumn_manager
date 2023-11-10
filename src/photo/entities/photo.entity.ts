import { Albumn } from 'src/albumn/entities/albumn.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Photo extends CustomBaseEntity {
  @Column({ length: 255, nullable: false, unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @ManyToOne(() => Albumn, (albumn) => albumn.photos)
  albumn: Albumn;

  @OneToMany(() => Comment, (comment) => comment.photo)
  comments: Comment[];

  @Column({ length: 1000, nullable: false })
  link: string;
}
