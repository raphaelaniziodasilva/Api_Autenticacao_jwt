import { Request, Response } from 'express'
import { BadRequestError } from '../helpers/api-erros'
import { userRepository } from '../repositories/userRepository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Vamos começar a construir os controladores que vai ser responsavel por cadastro de usuarios, login de usuarios
export class UserController {

	// cadastrando usuario
	async create(req: Request, res: Response) {

		// vou querer receber os dados do body para fazer o cadastro do usuaio
		const { name, email, password } = req.body

		// verificar se o email existe se ele ja foi cadastrado no banco de dados

		// vamos buscar o email la no banco de dados usando o repositorio para fazer essa busca
		const userExists = await userRepository.findOneBy({ email })

		// se o email ja existir vai me retornar um erro dizendo que o email ja existe		
		if (userExists) {
			throw new BadRequestError('E-mail já existe')
			
			// Não estamos usando o try-catch porque estamos usando o tratamento de erro e ele ja faz com que não precise usar nenhum try-catch ara tratar essas exceções 
		}

		// precisamos antes de fazer a criação do usuario criptografar a senha do usuario porque não devemos de formar alguma cadastrar a senha do usuario no banco de dados sem estar criptografada, utilizaremos o bcrypt para nos ajudar a fazer essa criptografia

		// criptografando a senha (password, 10) --> passando a senha normal e o salt. O salt significa a quantidade de nivel de processamento que o computador vai ter para poder criptografar a senha deixando mais segura 
		const hashPassword = await bcrypt.hash(password, 10)

		// com a senha criptografada depois quando for fazer o login e so comparar a haste que foi criptografada com a senha que esta tentando acessar a sua aplicação

		// agora podemos cadastrar o novo usuario no banco de dados
		const newUser = userRepository.create({
			name,
			email,
			password: hashPassword, // o valor da senha vai ser a senha criptografada
		})

		// salvando as informações do novo usuario no banco de dados
		await userRepository.save(newUser)

		// tirando o campo password de dentro do objeto que e retornado, porque não faz sentido retorna o hash senha que foi criada no banco de dados por questão de segurança
		const { password: _, ...user } = newUser

		// retornando os dados do novo usuario
		return res.status(201).json(user)

		// Vamos testar mais antes crie a rota la dentro do routes.ts
	}

	// criando login PARAMOS EM 59:00
	async login(req: Request, res: Response) {

		// vou querer receber os dados do body para fazer o cadastro do login
		const { email, password } = req.body

		const user = await userRepository.findOneBy({ email })

		if (!user) {
			throw new BadRequestError('E-mail ou senha inválidos')
		}

		const verifyPass = await bcrypt.compare(password, user.password)

		if (!verifyPass) {
			throw new BadRequestError('E-mail ou senha inválidos')
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', {
			expiresIn: '8h',
		})

		const { password: _, ...userLogin } = user

		return res.json({
			user: userLogin,
			token: token,
		})
	}

	async getProfile(req: Request, res: Response) {
		return res.json(req.user)
	}
}
