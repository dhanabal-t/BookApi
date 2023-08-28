import express from "express"
import mongoose from "mongoose"


 import books from "./routes/book.js"
 import users from './routes/users.js'


const app=express();
app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("This is a Book API")
})


 
app.use("/book",books)
app.use('/user',users)



mongoose.connect('mongodb+srv://admin:admin@api1.uioh4pi.mongodb.net/')
.then(() =>
app.listen(5000, () => {
  console.log(`server running on port 5000`);
})
)
.catch((err) => console.log(err.message));