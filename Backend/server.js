//Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors())


//let todos = [];

//connecting mongodb

mongoose.connect('mongodb://localhost:27017/mern-app')

.then(()=>{
    console.log("mongo db is connected")

})
.catch((err) =>{
    console.log(err)

})

//create a schema
const todoSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : String
})

//creating a model

const todoModel = mongoose.model('Todo',todoSchema);



//Create a new items in todo list.

app.post('/todos',async (req, res)=>{
    const {title,description} = req.body;
    //const newTodo ={
       // id: todos.length +1,
       // title,
        //description
   // };
   // todos.push(newTodo);
    //console.log(todos)

    try{
        const newTodo = new todoModel({title, description});
        await newTodo.save()
        res.status(201).json(newTodo);

    }catch(error){
        console.log(error)
        res.status(500).json({message : error.message});

    }
    

})

//Get all items
app.get('/todos', async (req, res)=>{
    try{
        const todo = await todoModel.find();
        res.json(todo);

    }catch(error){
        console.log(error)
        res.status(500).json({message : error.message})

    }
})


//update todo list item 

app.put("/todos/:id", async (req,res)=>{

    try{
         const {title,description} = req.body;
    const id = req.params.id;
    const uptodate = await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new :true}
)
if(!uptodate){
    return res.status(404).json;
}
res.json(uptodate);

    }catch(error){
        console.log(error)
        res.status(500).json({message : error.message})

    }
 

})

//delete an item

app.delete("/todos/:id",async (req,res)=>{
   try{
     const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
     
    res.status(204).end();
   }catch(error){
    console.log(error)
    res.status(500).json({message : error.message})
   }
})

const port = 8000;
app.listen(port, () =>{
    console.log("server is listening to port "+port)
})