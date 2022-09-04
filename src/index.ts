// Aqui e o arquivo principal do sistema 

import 'express-async-errors'
import express from 'express'
import { AppDataSource } from './data-source'
import { errorMiddleware } from './middlewares/error'
import routes from './routes'

// O AppDataSource e o arquivo de conexão com o banco de dados utilizando o TypeOrm, e dentro dele que eu faço a configuração do express. Vamos configurar o AppDataSource
AppDataSource.initialize().then(() => {

	// instância do express
	const app = express()

	// o tipo de dados que vamos trabalhar na aplicação vai ser o json
	app.use(express.json())

	// vai pegar todas as rotas que vamos utilizar
	app.use(routes)

	// errorMiddleware e o nosso middleware de tratamento de erros
	app.use(errorMiddleware)

	// aqui e onde vai ficar escutando a porta que vem lá do nosso dotenv que vai ser a porta 3000
	return app.listen(process.env.PORT)
})
