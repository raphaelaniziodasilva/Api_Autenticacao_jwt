// aqui vamos criar o repository pegando do data source

import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

// o getRepository pede a entidade que quero criar o repositorio 
export const userRepository = AppDataSource.getRepository(User)


// Agora ja temos um repositorio para que possamos fazer todas as implementações todas as operações de banco de dados através da entidade User

// Vamos criar os controllers
