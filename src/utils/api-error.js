class ApiError extends Error{
    constructor(statusCode,message){
        super(message);
        this.statusCode = statusCode,
        this.success = false,
        Error.captureStackTrace(this,this.constructor)
    }

    static badRequest(message="Bad Request"){
        throw new ApiError(400,message)
    }

    static unauthorized(message="Unauthorized Request"){
        throw new ApiError(401,message)
    }

    static forbidden(message="Access Denied"){
        throw new ApiError(403,message)
    }

    static notFound(message = "Not Found"){
        throw new ApiError(404,message)
    }

    static conflict(message="Conflict"){
        throw new ApiError(409,message);
    }

    static serverError(message="Internal Server Error"){
        throw new ApiError(500,message)
    }
}

export default ApiError;