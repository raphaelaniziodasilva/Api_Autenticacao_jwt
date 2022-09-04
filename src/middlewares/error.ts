// vamos ter aqui um middleware de tratamento de erro, onde qualquer exceção que aconteça no meu codigo qualquer lançamento de exceção também feita aqui na minha aplicação vai cair direto nesse middleware.

// E ai ele trata as informações para poder retornar de fato o erro que aconteceu no sistema e para que a minha aplicação não caia, para que eu não tenha nehum problema com a aplicação e o servidor não ficar fora do ar pro algu problema inesperado na api

import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../helpers/api-erros'

export const errorMiddleware = (
	error: Error & Partial<ApiError>,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = error.statusCode ?? 500
	const message = error.statusCode ? error.message : 'Internal Server Error'
	return res.status(statusCode).json({ message })
}

// vamos criar a pasta helpers e um arquivo api-erros.ts e fazer a configuração
