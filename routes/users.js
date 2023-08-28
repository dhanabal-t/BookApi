import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import users from '../models/auth.js'
import auth from "../middleware/auth.js"


import { login, signup ,logout,updatePassoword,blockUser} from "../controllers/auth.js";
import { resetpass,updatepass } from "../controllers/pass.js";

const router = express.Router();

router.use(cookieParser())

const authorization = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, 'secert');
      var user= await users.findOne({email:data.email});
      req.user=user
    return next();
  } catch {
    return res.sendStatus(403);
  }
}; 


router.post("/signup", signup);
router.post("/login",auth, login);
router.post('/logout',authorization,logout)
router.patch('/updatep/:id',updatePassoword)
router.post("/reset-p",resetpass)
router.post('/resetpass/:id',updatepass)
router.patch('/block/:id',blockUser)
 

export default router;