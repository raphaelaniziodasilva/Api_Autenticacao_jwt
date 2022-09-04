import { ByteLengthQueuingStrategy } from 'stream/web'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number

	// a coluna vai ser do tipo text
	@Column()
	name: string

	// a coluna email deve ser unica
	@Column({unique: true })	
	email: string
	
	@Column()
	password: string
}
// a entidade User criada, as migrations configuradas vamos criar a migrations e os seus arquivos e depois criar as entidades no banco de dados vamos fazer tudo pelo terminal

// Já consigo fazer o cadastro de usuário porque ja temos o banco de dados