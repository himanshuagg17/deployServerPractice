const express=require("express");
const connection=require("./db");
require("dotenv").config();

const {userRouter}=require("./routes/user.routes");

const {noteRouter}=require("./routes/notes.routes");
const { authenticate } = require("./middlewares/authenticate.middleware");


//getting this cors for cross origin resource sharing 
const cors=require("cors");




const app=express();
app.use(cors());

app.use(express.json());

//this is a middleware for the router ,if someone hits at user, the userRouter middleware is hit
app.use("/users",userRouter);

app.use(authenticate);
app.use("/notes",noteRouter);




app.get("/",(req,res)=>{
    res.send("the home page");
})


app.listen(process.env.port,async ()=>{
    try{
        await connection;
        console.log('connected to the database');
    }
    catch(err){
        console.log("the server was not connected");
    }
    console.log("the server is running at port 9000");
})