import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../helpers/api-erros'
import { userRepository } from '../repositories/userRepository'
import jwt from 'jsonwebtoken'

type JwtPayload = {
	id: number
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	
	// Existe varias formas de você receber token de autenticação em Api e a forma mais correta utilizando ApiRest e receber essas informações no headers no cabeçalho de sua requisição. Seria no headers do postman, insomnia

	// para pegar o token vamos passar ele dentro de uma propriedade que existe aqui dentro do headers chamada de authorization e esse authorization é exatamente onde passa o token da requisição	
	const { authorization } = req.headers

	// se não existir o authorization o usuario não tem a autorização para acessar o recurso que foi solicitado
	if (!authorization) {
		throw new UnauthorizedError('Não autorizado')
	}

	/* console.log(authorization) --> vai criar o codigo do Bearer Token e enviar para o terminal
	Va para o postman e em Authorization adicione o 
	type: Bearer Token depois adicione o token criado pelo login
	*/

	// com o Bearer Token criado vamos utilizar o jwt para verificar se o token e valido 

	// removendo o nome Bearer e pegando somente o token 
	const token = authorization.split(' ')[1]

	// verificar se o token de fato existe

	// o metodo verify do jwt ele vai retornar o id do usuario caso o token exista, se o token que passarmos dentro do verify existir ele vai trazer para mim todos os dados do Payload do usuario e vamos pegar de dentro do Payload um id, e para que possamos verificar temos que passar o token e a senha que criamos que esta la no arquivo .env

	// Então se estiver tudo certo no token e a assinatura dele for valida ele vai me retornar o upload do jwt

	const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

	// PARAMOS 1:10:00
	const user = await userRepository.findOneBy({ id })

	if (!user) {
		throw new UnauthorizedError('Não autorizado')
	}

	const { password: _, ...loggedUser } = user

	req.user = loggedUser

	next()
}
