import ApiError from '../utils/api-error.js'

const validate = (dtoClass) => (req,_,next)=>{
    const {errors,value} = dtoClass.validate(req.body);

    if(errors){
        ApiError.badRequest(errors.join("; "));
    }

    req.body = value;
    next();
}


export default validate