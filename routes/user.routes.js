const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userRouter=express.Router();
userRouter.use(express.json());

const {UserModel}=require("../model/user.model");


//the router to register the user ,encrypting the password
userRouter.post("/register",async (req,res)=>{
   // const userData=req.body;
    const {name,email,password}=req.body;
    try{

        bcrypt.hash(password, 5 ,async (err, hash)=> {
            // Store hash in your password DB.
            if(err) res.send(err.message);
            else {
                const user=new UserModel({name,email,password:hash});
                await user.save();
                res.send({"msg":"new user has been registered"})
            }
        });
       
    }
    catch(err){
        res.send({"msg":"something went wrong","err":err.message});
    }
})



//logging in by decrypting the password
userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    try{
        const user=await UserModel.find({email});
        if(user.length>0){

            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){

                    //the random payload we are passing here will be the userID


                   const token=jwt.sign({userID:user[0]._id},"masai");
                    //const token=jwt.sign({course:"backend"},"masai");

                    res.send({"msg":"logged in","token":token});
                }
                else{
                    res.send("the password does not match")
                }
            })
        }
        else{
            res.send("wrong credentials")
        }
    }
    catch(err){
         res.send({"msg":"something went wrong","error":err.message});
    }
    
})

module.exports={
    userRouter
}