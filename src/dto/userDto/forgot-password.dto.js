import Joi from 'joi'
import BaseDto from '../basedto.js'

class forgotPasswordDto extends BaseDto{
    static schema = Joi.object({
        email: Joi.string().email().required().trim().lowercase().max(322),
    })
}

export default forgotPasswordDto;

