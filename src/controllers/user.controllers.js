import * as AuthService from '../services/user.service.js'
import ApiResponse from '../utils/api-response.js'

const register = async(req,res)=>{
    const user = await AuthService.register(req.body)
    ApiResponse.created(res,"user registered successfully",{user})
}

export {
    register
}