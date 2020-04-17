const { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } = require("typeorm");

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
}
