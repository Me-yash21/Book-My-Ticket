import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'
import seatsRouter from './routes/seats.routes.js'
import authenticate from "./middlewares/authenticate.middleware.js";
import ApiError from "./utils/api-error.js";
import errorHandler from './middlewares/errorHandler.middleware.js'

const projectRoot = process.cwd()


const app = new express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get("/", authenticate, (req, res) => {
    res.sendFile(projectRoot + "/index.html");
});

app.get("/signup",(req,res)=>{
    res.sendFile(projectRoot + "/public/signup.html")
})

app.get("/login",(req,res)=>{
    res.sendFile(projectRoot + "/public/login.html")
})

app.use("/api/v1/user",userRouter);
app.use("/api/v1/seats",seatsRouter);


app.all("{*path}", (req, res) => {
    throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

app.use(errorHandler)

export default app