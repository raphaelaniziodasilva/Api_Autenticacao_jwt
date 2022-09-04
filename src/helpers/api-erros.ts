// aqui aonde vai ficar os status code de erros

// vamos ter uma abstração do erro padrão do node onde eu abstraio as informações dessa classe erro que são as padrões que vem, e eu crio minhas classes independentes de tratamento de erro

export class ApiError extends Error {
	public readonly statusCode: number

	constructor(message: string, statusCode: number) {
		super(message)
		this.statusCode = statusCode
	}
}

// temos uma bad request que quando for chamada vai retornar o status 400
export class BadRequestError extends ApiError {
	constructor(message: string) {
		super(message, 400)
	}
}

// temos o not found que quando for chamada vai retornar o status 404
export class NotFoundError extends ApiError {
	constructor(message: string) {
		super(message, 404)
	}
}

// temos o UnauthorizedError que quando for chamada vai retornar o status 401
export class UnauthorizedError extends ApiError {
	constructor(message: string) {
		super(message, 401)
	}
}
