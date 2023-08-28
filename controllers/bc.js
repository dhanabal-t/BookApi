import books from "../models/book.js";
import mongoose from "mongoose";
 

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