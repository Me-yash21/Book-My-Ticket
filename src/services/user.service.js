import {
    createUser,
    findUserById,
    findOne,
    setRefreshToken,
    setVerificationToken,
    setResetPasswordToken,
    changePassword
} from '../dao/user.dao.js'
import ApiError from '../utils/api-error.js';
import {generateResetToken} from '../utils/jwt-utils.js'
import {hashPassword,comparePassword} from '../utils/password-utils.js'
import {sendVerificationEmail,sendForgotPasswordEmail} from '../config/mail.js'

const register = async({name,email,password})=>{
    const existingUser = await findOne({email});
    //check if user exist with given email.
    if(existingUser){
        ApiError.conflict("Email is already registerd.")
    }

    const {rawToken,hasedToken} = generateResetToken();
    const hashedPassword = await hashPassword(password);

    const user = await createUser(name,email,hashedPassword,hasedToken);
    
    if(!user){
        ApiError.serverError("Server Error while registering a user")
    }
    //send verification email to user with rawToken
    await sendVerificationEmail(email,rawToken)

    delete user.password;
    delete user.verification_token;

    return user;
}

export {
    register,
}