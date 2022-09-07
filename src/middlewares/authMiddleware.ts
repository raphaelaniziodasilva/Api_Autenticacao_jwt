import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../helpers/api-erros'
import { userRepository } from '../repositories/userRepository'
import jwt from 'jsonwebtoken'

// vamos dizer para typescript que o id que esta no --> const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') ele existe 
type JwtPayload = {
	id: number

	// agora va na verificação to toke e diga que o jwt ele em o tipo jet JwtPayload 
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

	// precisamos verifica se existe usuario no banco de dados 
	const user = await userRepository.findOneBy({ id })

	// se o usuario não existir no banco de dados  
	if (!user) {
		throw new UnauthorizedError('Não autorizado')
	}

	// vamos retornar os dados do usuario sem a senha
	const { password: _, ...loggedUser } = user

	// retornando os dados do usuario, para resolver o problema do user vamos criar um tipo no express va para a pasta @types no arquivo expres.d.ts

	req.user = loggedUser // vamos chamar o req.use la no UserControlle

	// o next function ele autoriza esse middleware a executar a nova tarefa a proxima chamada
	next()
}
