import crypto from 'crypto'
import jwt from 'jsonwebtoken'

function generateResetToken(){
    const rawToken = crypto.randomBytes(24).toString('hex');

    const hasedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    return {rawToken,hasedToken}
}

function generateAccessToken(payload){
    return jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

function generateRefreshToken(payload){
    return jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

function verifyAccessToken(token){
    return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(token){
    return jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
}

export {
    generateResetToken,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
}
