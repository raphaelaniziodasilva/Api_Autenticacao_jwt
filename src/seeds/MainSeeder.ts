// Aqui vai ficar a ordem de execução das seeds

import { DataSource } from 'typeorm'
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension'
import { UserSeeder } from './UserSeeder'

export class MainSeeder implements Seeder {
	async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		// vamos gerenciar a ordem de execução de todas as seeds
		await runSeeder(dataSource, UserSeeder)
		// await runSeeder(dataSource, ProdutoSeeder)
		// await runSeeder(dataSource, CategoriaSeeder)
	}
}
