import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne } from 'typeorm';
import { Parent } from './Parent';
import { Child } from './Child';

@Entity()
export class ChildAudio {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
    @Column()
    transcript: string

    @Column()
    path: string

    @ManyToOne(type => Child, child => child.parentAudios)
    child: Child;
}