import Joi from 'joi'
import BaseDto from '../basedto.js'

class LoginDto extends BaseDto{
    static schema = Joi.object({
        email: Joi.string().email().required().trim().lowercase().max(322),
        password: Joi.string().min(8).required(),
    })
}

export default LoginDto;

