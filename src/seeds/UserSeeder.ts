import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { User } from '../entities/User'
import bcrypt from 'bcrypt'

// criando a seeds
export class UserSeeder implements Seeder {
	async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {

		// o userRepository vai ser o repositorio da entidade User
		const userRepository = dataSource.getRepository(User)

		// criando os dados do usuario que vai ser cadastrado no banco de dados
		const userData = {
			name: 'Barcelona futebol clube',
			email: 'barcelona@gmail.com',
			password: await bcrypt.hash('teste', 10), // criptografando a senha teste
		}

		// fazendo a validação se o usuario ja existir no banco de dados se existir não vai adicionar o mesmo usuario

		// buscando o usuario pelo email
		const userExists = await userRepository.findOneBy({ email: userData.email })

		// se o usuario não existir
		if (!userExists) {
			// salvando os dados do usuario no banco de dados
			const newUser = userRepository.create(userData)
			await userRepository.save(newUser)
		}
	}
}
