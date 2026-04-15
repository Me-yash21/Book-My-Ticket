import {Router} from 'express'
import validate from '../middlewares/validate.middleware.js';
import * as userDtos from '../dto/userDto/index.js'
import * as userController from '../controllers/user.controllers.js'
import authenticate from '../middlewares/authenticate.middleware.js'

const router = Router();

router.post(
    '/register',
    validate(userDtos.RegisterDto),
    userController.register
)

router.post(
    '/login',
    validate(userDtos.LoginDto),
    userController.login
)

router.post(
    '/logout',
    authenticate,
    userController.logout
)

router.post(
    '/refresh',
    userController.refresh
)

router.post(
    '/verify/:token',
    userController.verify
)

router.post(
    '/forgot-password',
    validate(userDtos.ForgotPasswordDto),
    userController.forgotPassword
)

router.post(
    '/reset-password/:token',
    validate(userDtos.ResetPasswordDto),
    userController.resetPassword
)

router.get(
    '/me',
    authenticate,
    userController.getMe
)
export default router