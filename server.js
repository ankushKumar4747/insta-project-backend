const express=require("express");
const app=express();
const server=require("http").createServer(app)
const socket=require("socket.io")
const connection=require("./common/connection")
const router=require("./router/index")
const io=socket(server)
require("dotenv").config()

app.use(express.json())

app.use("/api/insta",router)

server.listen(process.env.PORT,()=>{
    connection.mongodb();
    console.log(`Server is running on port ${process.env.PORT}`)
})