import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  secertcode:{type:String},
  isBlock:{type:Boolean,default:true},
});

export default mongoose.model("User", userSchema);

 