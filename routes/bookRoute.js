import express from 'express';
import { Book } from '../models/bookModels.js'
import { Auth } from '../middleware/Auth.js';

const router = express.Router();

router.use(Auth)


// Creating a new book

router.post("/",async (request, response) => {
    try {
      if (
        !request.body.title ||
        !request.body.author ||
        !request.body.publishYear
      ) {
        return response.status(400).send({
          message: "Enter all the required fields: title, author and publishYear",
        });
      }

    

      const newBook = {
        title: request.body.title,
        author: request.body.author,
        publishYear: request.body.publishYear,
        image: request.body.image,
        createdBy:request.id._id
      };
      const book = await Book.create(newBook);
      return response.status(201).send(book);
  
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });
  
//Get All Books
  
router.get('/',async(request,response)=>{
    try{
      const books = await Book.find({createdBy:request.id._id});
      return response.status(200).json({
        count: books.length,
        data:books,
      });
  
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
})
  
//Get A Book by Id
  
router.get('/:id',async(request,response)=>{
  try{
    const { id } = request.params;
    const book= await Book.findById(id);
    return response.status(200).json(book);

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
})
  
  
// Update a Book
  
router.put('/:id',async(request,response) =>{
    try{
      if (
        !request.body.title ||
        !request.body.author ||
        !request.body.publishYear
      ) {
        return response.status(400).send({
          message: "Enter all the required fields: title, author and publishYear",
        });
      }
      const { id } = request.params;
      const result = await Book.findByIdAndUpdate(id, request.body);
      if (!result) {
        return response.status(404).json({ message: 'Book not found'});
      }
      return response.status(200).send({ message: 'Book updated successfully'});
  
    }catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  
  })
  
// Delete A Book
  
router.delete('/:id',async(request,response) =>{
    try{
      const { id } = request.params;
      const result = await Book.findByIdAndDelete(id);
      if (!result) {
        return response.status(404).json({ message: 'Book not found'});
      }
      return response.status(200).send({ message: 'Book Deleted successfully'});
  
    }catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  
  })

  export default router;
  
  
  