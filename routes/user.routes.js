const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userRouter=express.Router();
userRouter.use(express.json());

const {UserModel}=require("../model/user.model");



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

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generated id of user
 *              name:
 *                  type: string
 *                  description: The username
 *              email:
 *                  type: string
 *                  description: The user email
 *              age:
 *                  type: integer
 *                  description: The user's age
 *                     
 *    
 */

/**
 * @swagger
 * /users:
 *  get:
 *      summary: This will get all the user data from the database
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: The list of all the users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/User"
 *                
 *                                  
 *                          
 *  
 */
userRouter.get("/",async(req,res)=>{
    const users=await UserModel.find();
    res.send(users);
})



/**
* @swagger
* /users/create:
*   post:
*       summary: To post the details of a new user
*       tags: [Users]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: The user was successfully registered
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           500:
*               description: Some server error
*/

userRouter.post("/create",async (req,res)=>{
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
 
 


/**
 * @swagger
 * /users/update/{id}:
 *  patch:
 *      summary: This will get all the user data from the database
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              required: true
 *              description: The user id  
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/User"
 *      responses:
 *          200:
 *              description: the user details have been updated
 *              content:
 *                  application/json:
 *                      schema:
 *                        $ref: "#/components/schemas/User"
 *          404:
 *              description: the user was not found
 *                
 *                                  
 *                          
 *  
 */

userRouter.patch("/update/:id",async(req,res)=>{
    const id=req.params.id;
    const payload=req.body;
    await UserModel.findByIdAndUpdate({_id:id},payload)
    res.send({"msg":"User details have been updated"});
})



//delete the user
userRouter.patch("/delete/:id",async(req,res)=>{
    const id=req.params.id;
    await UserModel.findByIdAndDelete({_id:id})
    res.send({"msg":"User details have been updated"});
})



/**
 * @swagger
 * /users/delete/{id}:
 *  delete:
 *      summary: This will get all the user data from the database
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *              required: true
 *              description: The user id  
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/User"
 *      responses:
 *          200:
 *              description: the user details have been updated
 *              content:
 *                  application/json:
 *                      schema:
 *                        $ref: "#/components/schemas/User"
 *          404:
 *              description: the user was not found
 *                
 *                                  
 *                          
 *  
 */


module.exports={
    userRouter
}