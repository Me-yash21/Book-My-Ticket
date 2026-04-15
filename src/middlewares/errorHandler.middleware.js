
const errorHandler = (err, req, res, next) => {
    
    // Determine status code based on error type
    const statusCode = err.statusCode || 500;
    
    // Standard error response
    const errorResponse = {
      success: false,
      error: {
        statusCode: err.statusCode || err.name || 'UNKNOWN_ERROR',
        message: err.message || 'An unexpected error occurred',
      }
    };

    // if user is not login and error Unauthorized Request then 
    // redirect the user to the login page.
    if(err.message === "Unauthorized Request"){
      res.redirect(`${process.env.FRONTEND_DOMAIN}/login`)
    }
    else{
      return res.status(statusCode).json(errorResponse);
    }
};

export default errorHandler;

