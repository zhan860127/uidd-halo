import {
  Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn,
  CreateDateColumn, ManyToMany, OneToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { Parent } from './Parent';
import { Image } from './Image';
import { ParentAudio } from './ParentAudio';
import { ChildAudio } from './ChildAudio';

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @Column()
  name: string;

  @Column({ default: '' })
  token: string;

  @ManyToMany((t) => Parent, (parent) => parent.children)
  parents: Parent[];

  @OneToOne((type) => Image)
  @JoinColumn()
  image: Image;

  @OneToMany((type) => ParentAudio, (pa) => pa.child)
  parentAudios: ParentAudio[];

  @OneToMany((type) => ChildAudio, (ca) => ca.child)
  childAudios: ChildAudio[];
}
