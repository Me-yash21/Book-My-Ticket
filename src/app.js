import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'
import seatsRouter from './routes/seats.routes.js'
import authenticate from "./middlewares/authenticate.middleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));


const app = new express();
app.use(cors());
app.use(cookieParser());

app.get("/", authenticate, (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use("/api/v1/user",userRouter);
app.use("/api/v1/seats",seatsRouter);

export default app