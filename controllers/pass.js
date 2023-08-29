import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import nodemailer from "nodemailer"

import users from '../models/auth.js'

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
 

function generateRandomNumber() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math
    .random() * (maxm - minm + 1)) + minm;
}

export const resetpass=async(req,res)=>{
    // const { id: _id } = req.params;
    const {email}=req.body;
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User is not there." });
    }
    try{
        let secertcode = generateRandomNumber();
        // const secert =await users.findByIdAndUpdate( _id, {$set:  { 'Secertcode' : secertcode}});
        user.secertcode=secertcode;
        await user.save();

        let info=await  transporter.sendMail({
            from:'demofornodeapp@gmail.com',
            to: user.email,
            subject:"Reset Code Sent",
            html:`<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #4258bf;text-decoration:none;font-weight:600">Airvays content portal Reset password OTP</a>
              </div>
              <p style="font-size:1.1em">Hello,</p>
              <p>Thank you for using Airvays content portal. To reset password for your content portal account use the following OTP.</p>
              <h2 style="background: #4258bf;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${secertcode}</h2>
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
        res.status(200).send({"message":"Successfully Send the Mail"})
}
    catch(err){
        res.status(500).send(err)
      console.log(err)    }

}


export const updatepass=async(req,res)=>{
  const { id: _id } = req.params;
  const {secert,password}=req.body;
  const user = await users.findOne({ _id });
  if (!user) {
    return res.status(404).json({ message: "User is not there." });
  }
   try{
    let code=user.secertcode;
    let pass=user.password;
    const isPasswordCrt = await bcrypt.compare(password, pass);
      if(code === secert && !isPasswordCrt){
        let hashedPassword = await bcrypt.hash(password, 12);
        const updatep=await users.findByIdAndUpdate( _id, { $set: { 'password' : hashedPassword}});
        // user.password=hashedPassword;
        // await user.save();
        res.status(200).json({message:"Successfully password updated"});
        user.secertcode=null;
        await user.save();
      }
      else if(isPasswordCrt){
        res.json({message:"Password should not be previous"})
      }
      else{
        res.json({message:"OTP is not valid"})
      }
    }catch(err){
      res.status(500).send(err);
    }

}