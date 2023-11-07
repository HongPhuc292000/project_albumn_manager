import { CustomBaseEntity } from 'src/common/entities/base.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Albumn extends CustomBaseEntity {
  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 1000 })
  description: string;

  @OneToMany(() => Photo, (photo) => photo.albumn)
  photos: Photo[];
}
