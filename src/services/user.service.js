import {
    createUser,
    findUserById,
    findOne,
    setRefreshToken,
    setVerificationToken,
    setResetPasswordToken,
    changePassword,
    setIsVerified,
    findUserByResetPasswordToken
} from '../dao/user.dao.js'
import ApiError from '../utils/api-error.js';
import {generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken} from '../utils/jwt-utils.js'
import {hashPassword,comparePassword} from '../utils/password-utils.js'
import {sendVerificationEmail,sendForgotPasswordEmail} from '../config/mail.js'
import crypto from 'crypto'

function hashToken(token){
    return crypto.createHash('sha256').update(token).digest('hex')
}

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

const login = async({email,password}) =>{
    const user = await findOne({email},{verification_token: 0})
    if(!user){
        ApiError.badRequest("Email is not registered.")
    }
    
    const isPasswordMatched = await comparePassword(password,user.password);
    if(!isPasswordMatched) ApiError.badRequest("Email or password is invalid.");

    if(!user.isverified) ApiError.unauthorized("Verify your email before login");

    const accessToken = generateAccessToken({
        id:user.id,
        name: user.name
    })
    const refreshToken = generateRefreshToken({
        id:user.id
    })

    // set hashed refreshToken in the database
    await setRefreshToken(user.id,hashToken(refreshToken));

    delete user.password;
    delete user.refresh_token;

    return { user, accessToken, refreshToken}
}

const logout = async(userId) =>{
    // set the refreshToken to null. 
    await setRefreshToken(userId,null)
}

const refresh = async(token)=>{
    if(!token) ApiError.badRequest("Refresh token is missing");
    const decodedToken = verifyRefreshToken(token)

    const user = await findUserById(decodedToken.id,{password:0, verification_token:0});
    if(!user) ApiError.notFound("User is not found")

    if(hashToken(token) !== user.refresh_token ){
        ApiError.unauthorized("Token is invalid or expired")
    }

    // generate new refresh and accessToken
    const accessToken = generateAccessToken({
        id: user.id,
        name: user.name
    })

    const refreshToken = generateRefreshToken({
        id: user.id
    })

    // update the hashed refresh token in the database
    await setRefreshToken(user.id, hashToken(refreshToken));

    delete user.refresh_token;

    return { user, accessToken, refreshToken}
}

const verify = async(verificationToken) =>{
    const hashVerificationToken = hashToken(verificationToken);
    const user = await findOne({verification_token:hashVerificationToken},{password:0, refresh_token:0})

    if(!user){
        ApiError.badRequest("Invalid verification Token")
    }

    // update isVerified to true and remove the verifcation token from the user.
    await setIsVerified(user.id,true);
    await setVerificationToken(user.id,null);

    const updatedUserObj = await findUserById(user.id,{password:0, refresh_token: 0,verification_token: 0 ,reset_password_token:0})
    return updatedUserObj;
}

const forgotPassword = async({email}) =>{
    const user = await findOne({email});
    if(!user){
        ApiError.badRequest("Email is not registerd")
    }

    const {rawToken, hasedToken} = generateResetToken();
    // save the hasedToken in DB and send email to user with rawToken
    await setResetPasswordToken(user.id,hasedToken);
    await sendForgotPasswordEmail(email,rawToken)
}

const resetPassword = async(resetToken,newPassword)=>{
    const hashResetToken = hashToken(resetToken);
    const user = await findUserByResetPasswordToken(hashResetToken)

    if(!user){
        ApiError.badRequest("invalid Token");
    }

    const newHashPassword = await hashPassword(newPassword);
    await changePassword(user.id,newHashPassword);

    //after reseting the password, set the resetToken to null
    await setResetPasswordToken(user.id,null)

    delete user.password;
    delete user.refresh_token;
    delete user.reset_password_token;

    return user
}

const getMe = async(userId)=>{
    const user = await findUserById(userId,{password:0, refresh_token:0, verification_token:0, reset_password_token:0 });
    return user;
}
export {
    register,
    login,
    logout,
    refresh,
    verify,
    forgotPassword,
    resetPassword,
    getMe,
}
