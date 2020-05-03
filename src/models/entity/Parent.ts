import {
  Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn,
  CreateDateColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { Child } from './Child';
import { Image } from './Image';
import { ParentAudio } from './ParentAudio';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany((t) => Child, (child) => child.parents)
  @JoinTable()
  children: Child[];

  @OneToOne((type) => Image)
  @JoinColumn()
  image: Image;

  @OneToMany((t) => ParentAudio, (a) => a.parent)
  audios: ParentAudio[];
}
