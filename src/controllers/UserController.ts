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

	// criando login
	async login(req: Request, res: Response) {

		// vou querer receber os dados do body para fazer o cadastro do login
		const { email, password } = req.body

		// buscando o email do banco de dados
		const user = await userRepository.findOneBy({ email })

		// verificando se o email não existe
		if (!user) {
			throw new BadRequestError('E-mail ou senha inválidos')
		}

		// validando se a senha do usuario esta correta para esse email

		// fazendo a comparação da senha que esta no banco de dados criptografada com a senha que esta vindo do login que também esta criptografada pois o usuario esta tentando logar ou seja comparando a senha do login com a hash da senha do banco de dados

		const verifyPass = await bcrypt.compare(password, user.password)

		// verificando se senha esta correta se não estiver recebera a mensagem de erro 
		if (!verifyPass) {
			throw new BadRequestError('E-mail ou senha inválidos')
		}
		
		// autenticando o usuario, criando a assinatura do token para isso eu preciso passar o payload ou seja as informações que eu quero armazenar dentro desse token
		
		// armazenando o id do usuario porque atraves do id vou buscar la no banco de dados as outras informações

		// process.env.JWT_PASS --> criando a senha e para deixar a senha segura vou colocar no arquivo .env e pegando a senha com o process.env. a senha que esta no arquivo env

		const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', {
			// passando as opções do token
			expiresIn: '8h', // prazo de expiração
		})

		// tirando o campo password de dentro do objeto que e retornado, porque não faz sentido retorna o hash senha que foi criada no banco de dados por questão de segurança 
		const { password: _, ...userLogin } = user

		// retornando um objeto que vai ter os dados do usuario e o token
		return res.json({
			user: userLogin, // retornando os dados sem a senha
			token: token, // retornando o token que foi gerado	
		})
	}

	// Com o login de usuarios funcionando, atraves dele eu consigo ja autenticar um usuario e eu vou verificar se esse usuario autenticado ele esta logado ou não

	// a função getProfile vai ser um endpoint onde o usuario vai conseguir obter seus dados com base no token de login ou seja ele não vai passar nehuma informação para a rota e atraves do token de autenticação dele agente vai retornar todos os dados dele isso é uma rota protegida e pode ser todas as outras rotas protegidas do seu sistema da mesma forma	
	async getProfile(req: Request, res: Response) {

		// vindo do authmiddleware
		return res.json(req.user)

		// Se tivermos varios endpoints na aplicação onde também são rotas protegidas ou seja em cada endpoint eu vou precisar validar se o usuario esta logado e teria que fazer para cada um a estrutura desde o começo para cada uma das rotas

		// Para isso vamos fazer a reutilização de codigo, vamos criar um middleware de autenticação va para pasta middleware e crie um arquivo authMiddleware.ts
	}
}
