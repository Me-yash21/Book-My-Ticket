import { findUserById } from '../dao/user.dao.js';
import ApiError from '../utils/api-error.js'
import {verifyAccessToken} from '../utils/jwt-utils.js'

const authenticate = async(req,_,next)=>{
    const accessToken = req.cookies?.accessToken || req.headers.authorization.replace('Bearer ',"")
    if(!accessToken) ApiError.unauthorized("Unauthorized Request");

    const decodedToken = verifyAccessToken(accessToken);
    const user = await findUserById(decodedToken.id);

    if(!user) ApiError.unauthorized("Invalid access token")

    req.user = {
        id: user.id,
        name: user.name,
        email: user.email
    }

    next();
}

export default authenticate