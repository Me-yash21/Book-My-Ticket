import Joi from 'joi'
import BaseDto from '../basedto.js'

class resetPasswordDto extends BaseDto{
    static schema = Joi.object({
        newPassword: Joi.string().min(8).required(),
    })
}

export default resetPasswordDto;

