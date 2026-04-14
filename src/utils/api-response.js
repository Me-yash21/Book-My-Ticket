class ApiResponse {
    static ok(res,message="ok",data=null){
        return res.status(200).json({
            success: true,
            message,
            data
        })
    }

    static created(res,message="created",data=null){
        return res.status(201).json({
            success:true,
            message,
            data
        })
    }

    static noContent(res,message="No content"){
        return res.status(204).json({
            success: true,
            message
        })
    }
}

export default ApiResponse;