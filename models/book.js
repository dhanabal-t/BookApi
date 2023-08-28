import mongoose from "mongoose";

const bookschema=new mongoose.Schema({
    autherName:{ type: String, required: true },
    bookName:{ type: String, required: true},
    bookDesc:{ type: String},
    bookPrice:{type:Number,required:true},
    image:{data:Buffer,contentType:String}
})

export default mongoose.model("Book",bookschema)