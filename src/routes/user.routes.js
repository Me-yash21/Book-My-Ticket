import {Router} from 'express'
import validate from '../middlewares/validate.middleware.js';
import * as UserDtos from '../dto/userDto/index.js'
import * as UserController from '../controllers/user.controllers.js'

const router = Router();

router.post(
    '/register',
    validate(UserDtos.RegisterDto),
    UserController.register
)


export default router