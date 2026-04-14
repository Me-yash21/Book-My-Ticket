import * as authService from '../services/user.service.js'
import ApiResponse from '../utils/api-response.js'

const register = async(req,res)=>{
    const user = await authService.register(req.body)
    ApiResponse.created(res,"user registered successfully",{user})
}

const login = async(req, res)=>{
    const {user, accessToken, refreshToken } = await authService.login(req.body);
    // can be save the access token in the cookies. 
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7d 
    });
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        maxAge: 24 * 60 * 60 * 1000 // 1d
    })
    ApiResponse.ok(res,"Login successfully",{user,accessToken})
}

const logout = async(req,res)=>{
    await authService.logout(req.user.id)
    res.clearCookie("refreshToken")
    res.clearCookie("accessToken")
    ApiResponse.ok(res,"Logout successfully")

}

const refresh = async(req, res)=>{
    const token = req.cookies.refreshToken
    const {user, accessToken, refreshToken} = await authService.refresh(token);

    // update the refresh token in the cookie
    res.cookie("refreshToken",refreshToken,{
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7d 
    })

    ApiResponse.ok(res,"Tokens update successfully",{user,accessToken})
}

const verify = async(req, res) =>{
    const token = req.params.token;
    const user = await authService.verify(token)
    
    ApiResponse.ok(res, "User verified successfully",{user})
}

const forgotPassword = async(req,res)=>{
    await authService.forgotPassword(req.body);

    ApiResponse.ok(res,"Password reset link send successfully to email")
}

const resetPassword = async (req,res)=>{
    const token = req.params.token;
    const user = await authService.resetPassword(token, req.body.newPassword)

    ApiResponse.ok(res,"Password Reset successfully.",{user})
}

export {
    register,
    login,
    refresh,
    logout,
    verify,
    forgotPassword,
    resetPassword,
}