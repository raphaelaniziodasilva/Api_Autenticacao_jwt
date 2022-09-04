import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { authMiddleware } from './middlewares/authMiddleware'

const routes = Router()

// cadastro de usuario, pegando o controlador UserController e o metodo create que e o metodo de criação de usuario
routes.post('/user', new UserController().create)

routes.post('/login', new UserController().login)

routes.use(authMiddleware)

routes.get('/profile', new UserController().getProfile)

export default routes
