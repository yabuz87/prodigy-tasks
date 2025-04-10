import express from "express";
import dotenv from "dotenv";
 dotenv.config();
 import cookieParser from "cookie-parser";
import connect  from './utils/mongodb.js';
import medRouter from "./router/medRouter.js"
import pharmaRoute from "./router/pharmaAuthRouter.js";

const app=express();

const port=process.env.PORT || 5000
app.use(cookieParser());
app.use(express.json());

app.use("/med",medRouter);
app.use("/pharmacy",pharmaRoute);
app.use(express.urlencoded({extended:false}));


app.listen(port,()=>{
    connect();
    console.log(`ther server is listening to ${port}`);
})