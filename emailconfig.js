import nodemailer from "nodemailer"


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
   port: 465,
   secure: true,
    auth:{
        user:'demofornodeapp@gmail.com',
        pass:'epoepffexzbheuel'
    }
})

export default transporter;