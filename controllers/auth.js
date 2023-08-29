import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"
import dotenv from "dotenv"

import users from "../models/auth.js";
import books from "../models/book.js";
 

dotenv.config();


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
   port: 465,
   secure: true,
    auth:{
        user:process.env.USER,
        pass:process.env.PASS
    }
})

let sendconfirmmail=async({email})=>{

  await  transporter.sendMail({
    from:'demofornodeapp@gmail.com',
    to: email,
    subject:"Sign Up Confirmation Mail",
    html:`<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #4258bf;text-decoration:none;font-weight:600">Thank you for choosing Fizota content Platform</a>
      </div>
      <p style="font-size:1.1em">Hello ${email}</p>
      <p>Your account has been successfully registered. Please wait for our team to activate your account.</p>
      <h2 style="background: #4258bf;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"></h2>
      <p style="font-size:0.9em;">Regards,<br />Airvays team</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Airvays Technologies Pte Ltd</p>
        <p>7 soon lee street, #02-45 ISPACE</p>
        <p>Singapore 627608</p>
      </div>
    </div>
  </div>`  
},(error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
})
}


export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User already Exist." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await users.create({
      email,
      password: hashedPassword
    }).then((result)=>sendconfirmmail(result));
    return res.status(200).json({ message:"Sign up success"});
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User don't Exist." });
    }

    const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
     let token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      'secert',
      { expiresIn: "1h" }
    );
    return res
    .cookie("token", token, {
      httpOnly: true,
    }).status(200).json({ result: existinguser,token});
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

 

export const logout=async(req, res) => {
  try {
  res.clearCookie("token").status(200).json({ message: "Successfully logged out " });
  } catch (error) {
      res.status(500).send(error)
  }
}


export const updatePassoword = async (req,res) => {
  const { id: _id } = req.params;
    const {password} = req.body;
    const existinguser = await users.findOne({ _id });
    if (!existinguser) {
      return res.status(404).json({ message: "User is not there." });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
        const updatep=await users.findByIdAndUpdate( _id, { $set: { 'password' : hashedPassword}});
        res.status(200).json(updatep);
      } catch (error) {
        res.status(500).json("Something went worng...");
    }
}

export const blockUser=async(req,res)=>{
  const {id:_id}=req.params;
  const {block}=req.body;
  const  user = await users.findOne({ _id });
    if (!user) {
      return res.status(404).json({ message: "User is not there." });
    }
    try {
        const blockuser=await users.findByIdAndUpdate( _id, { $set: { 'isBlock' : block}});
        // user.isBlock=block;
        // await user.save();
        if(block===true){
          res.status(200).json("block the user");
        }
        else{
          res.status(200).json("Unblock the user");
        }
      } catch (error) {
        res.status(500).json("Something went worng...");
    }

}
 
export const  postBook = async (req,res)=>{
    try {
        const existingbook = await books.findOne({ bookName:req.body.bookName });
        if (existingbook) {
          return res.status(404).json({ message: "Book already Exist." });
        }
        const newBook = await books.create({
            autherName:req.body.autherName,
            bookName:req.body.bookName,
            bookDesc:req.body.bookDesc,
            bookPrice:req.body.bookPrice,
            image:{
              data:req.file.filename,
              contentType:'image/jpg'
          }
        });
        res.status(200).json({ result: newBook});
      } catch (error) {
        res.status(500).json("Something went worng...");
      }
}

export const getBook= async (req,res)=>{
    const { id: _id } = req.params;
    try {
        const existingbook = await books.findOne({ _id });
        if (!existingbook) {
          return res.status(404).json({ message: "Book is not there." });
        }
        const Book = await books.findById( _id );
        res.status(200).json(Book);
      } catch (error) {
        res.status(500).json("Something went worng...");
      }

}

export const getBooka= async (req,res)=>{
  const { auther: autherName } = req.params;
  try {
      const existingbook = await books.findOne({ autherName});
      if (!existingbook) {
        return res.status(404).json({ message: "Book is not there." });
      }
      const Book = await books.find({autherName} );
      res.status(200).json(Book);
    } catch (error) {
      res.status(500).json("Something went worng...");
    }

}

export const updateBook = async (req,res) => {
  const { id: _id } = req.params;
    const {autherName,bookName,bookDesc,bookPrice} = req.body;
    const existingbook = await books.findOne({ _id });
    if (!existingbook) {
      return res.status(404).json({ message: "Book is not there." });
    }
    try {
        const updateb=await books.findByIdAndUpdate( _id, { $set: { 'autherName' : autherName,'bookName':bookName,'bookDesc':bookDesc,'bookPrice':bookPrice}});
        res.status(200).json(updateb);
      } catch (error) {
        res.status(500).json("Something went worng...");
    }
}

export const deleteBook = async ( req, res ) => {
    const { id:_id } = req.params;

    const existingbook = await books.findOne({ _id });
        if (!existingbook) {
          return res.status(404).json({ message: "Book is not there." });
        }
    try{
        await  books.findByIdAndDelete(_id);
        res.status(200).json({ message: "Successfully deleted..."})
    }catch(error){
        res.status(405).json(error)
    }
}