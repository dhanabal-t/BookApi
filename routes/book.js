import express from "express"
import multer from "multer";

import { postBook,getBook,getBooka,updateBook,deleteBook } from  "../controllers/bc.js"
 

const router=express.Router()

 

const Storage=multer.diskStorage({
  destination:'uploads',
  filename:(req,file,cb)=>{
      cb(null,file.fieldname)
  }
})

const upload=multer({
  storage:Storage,
})

router.post("/postb",upload.single('testImage'),postBook)
router.put("/updateb/:id",updateBook)
router.get('/getb/:id',getBook)
router.get('/getbb/:auther',getBooka)
router.delete('/deleteb/:id',deleteBook)
// router.post('/upload',uploadImage)


export default router