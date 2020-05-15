import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column()
  path?: string;
}

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column()
  name?: string;

  @Column({ default: '' })
  token?: string;

  @ManyToMany((t) => Parent, (parent) => parent.children)
  parents?: Parent[];

  @OneToOne((type) => Image)
  @JoinColumn()
  image?: Image;

  @OneToMany((type) => ParentAudio, (pa) => pa.child)
  parentAudios?: ParentAudio[];

  @OneToMany((type) => ChildAudio, (ca) => ca.child)
  childAudios?: ChildAudio[];
}

@Entity()
export class ChildAudio {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column()
  recordedAt?: Date;

  @Column()
  transcript?: string;

  @Column()
  path?: string;

  @ManyToOne((type) => Child, (child) => child.parentAudios)
  child?: Child;
}

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column()
  username?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToMany((t) => Child, (child) => child.parents)
  @JoinTable()
  children?: Child[];

  @OneToOne((type) => Image)
  @JoinColumn()
  image?: Image;

  @OneToMany((t) => ParentAudio, (a) => a.parent)
  audios?: ParentAudio[];
}

@Entity()
export class ParentAudio {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column()
  keyword?: string;

  @Column()
  path?: string;

  @ManyToOne((type) => Parent, (parent) => parent.audios)
  parent?: Parent;

  @ManyToOne((type) => Child, (child) => child.parentAudios)
  child?: Child;
}
