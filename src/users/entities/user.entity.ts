import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 20 })
  firstName!: string;

  @Column({ length: 20 })
  lastName!: string;

  @Column({ unique: true, length: 100 })
  email!: string;

  // @Exclude() trae todo de la bdd y luego saca la passwordHash al transformar
  // el objeto para enviarlo al cliente. select: false provoca que al pedir un usuario
  // este te venga desde la bdd sin su passwordHash.
  @Column({ length: 255, select: false })
  passwordHash!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
