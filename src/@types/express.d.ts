// aqui dentro vai ser um aruivo de tipo do back end onde vamos configurar algumas informações do express

import { User } from '../entities/User'

declare global {
	namespace Express {
		export interface Request {
			user: Partial<User>
		}
	}
}

// Para que o express indetifique esse comando va para o ts config fazer a configuração 
