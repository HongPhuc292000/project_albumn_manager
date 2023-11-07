import { Albumn } from 'src/albumn/entities/albumn.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { CustomBaseEntity } from 'src/common/entities/base.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User extends CustomBaseEntity {
  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 20, nullable: false, unique: true })
  username: string;

  @Column({ length: 20, nullable: false })
  password: string;

  @Column({ length: 320, nullable: false, unique: true })
  email: string;

  @Column({ type: 'smallint', default: 0 })
  isVerified: number;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToMany(() => Albumn)
  @JoinTable({
    name: 'user_albumn',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'albumnId',
      referencedColumnName: 'id',
    },
  })
  albumns: Albumn[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_user',
    joinColumn: {
      name: 'followerId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'partnerId',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @ManyToMany(() => Photo)
  @JoinTable({
    name: 'user_like_photo',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'photoId',
      referencedColumnName: 'id',
    },
  })
  likedPhotos: Photo[];
}
