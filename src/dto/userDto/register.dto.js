import Joi from 'joi'
import BaseDto from '../basedto.js'

class RegisterDto extends BaseDto{
    static schema = Joi.object({
        name: Joi.string().required().trim().min(2).max(50),
        email: Joi.string().email().required().trim().lowercase().max(322),
        password: Joi.string().min(8).required(),
    })
}

export default RegisterDto;

