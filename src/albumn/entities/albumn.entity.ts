import { CustomBaseEntity } from 'src/utils/base.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Albumn extends CustomBaseEntity {
  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 1000 })
  description: string;

  @OneToMany(() => Photo, (photo) => photo.albumn)
  photos: Photo[];

  @ManyToMany(() => User, (user) => user.albumns)
  users: User[];
}
