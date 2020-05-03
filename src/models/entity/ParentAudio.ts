import {
  Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne,
} from 'typeorm';
import { Parent } from './Parent';
import { Child } from './Child';

@Entity()
export class ParentAudio {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  keyword: string;

  @Column()
  path: string;

  @ManyToOne((type) => Parent, (parent) => parent.audios)
  parent: Parent;

  @ManyToOne((type) => Child, (child) => child.parentAudios)
  child: Child;
}
