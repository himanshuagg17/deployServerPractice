const express=require("express");
const connection=require("./db");
require("dotenv").config();

const {userRouter}=require("./routes/user.routes");

const {noteRouter}=require("./routes/notes.routes");
const { authenticate } = require("./middlewares/authenticate.middleware");


//step 2 (importing the swaggerjsdoc and swagger-ui-express)(step 1 was installing them)
const swaggerUI=require("swagger-ui-express");
const swaggerJsDoc=require("swagger-jsdoc");


//getting this cors for cross origin resource sharing 
const cors=require("cors");




const app=express();
app.use(cors());

app.use(express.json());


//step 3 (writing these specifications)
//giving the specifications for the swagger UI OAS
const options={
    definition:{
        openapi:"3.0.0",
        info:{
             title:"learning swagger for the first time",
             version:"1.0.0"
        },
        server:[
            {
                //the link of the url from where the server is going to be connected.
                url:"http://localhost:9000"
                //url:"https://fierce-lime-jacket.cyclic.app"
            }
        ]
    },
    //it has the link of the file where the  apis are present
    apis:["./routes/*.js"]
}


//step 4 (making the swaggerspecs which makes the UI)
const swaggerSpecs=swaggerJsDoc(options)
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerSpecs))




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