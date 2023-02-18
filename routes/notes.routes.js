const express=require("express");

const noteRouter=express.Router();
noteRouter.use(express.json());
const {NotesModel}=require("../model/notes.model");


//creating a new note
noteRouter.post("/create",async (req,res)=>{
    const noteData=req.body;
    const note=new NotesModel(noteData);
    await note.save()
    res.send("note has been created");
})



//router to get all the notes
noteRouter.get("/",async (req,res)=>{

     const notes=await NotesModel.find()

     res.send(notes);
})


//router to get all the notes of a paricular user by its userID
noteRouter.get("/",async (req,res)=>{
    
    const notes=await NotesModel.find()

    res.send(notes);
})


//deleting a particular note by its id.
noteRouter.delete("/delete/:id",async(req,res)=>{
    const noteId=req.params.id;
    await NotesModel.findByIdAndDelete({_id:noteId});
    res.send("the particular note has been deleted");
})


//updating a particular note by its id

module.exports={
    noteRouter
}