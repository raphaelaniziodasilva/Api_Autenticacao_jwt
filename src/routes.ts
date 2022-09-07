import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { authMiddleware } from './middlewares/authMiddleware'

const routes = Router()

// cadastro de login, pegando o controlador UserController e o metodo login que e o metodo de criação de login
routes.post('/login', new UserController().login)

routes.use(authMiddleware)

// fazendo a autorização do usuario 
routes.get('/profile', new UserController().getProfile)

// cadastro de usuario, pegando o controlador UserController e o metodo create que e o metodo de criação de usuario
routes.post('/user', new UserController().create)

export default routes
