import express from "express"
import client from "./config/config.js";


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



client.connect().then(() =>
app.listen(5000, () => {
  console.log(`server running on port 5000`);
})
)
.catch((err) => console.log(err.message));