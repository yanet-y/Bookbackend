import express, { response } from 'express';
import mongoose from 'mongoose'; 
import bookRoute from './routes/bookRoute.js'
import cors from 'cors'
import dotenv from 'dotenv';  
import userRouter from './routes/userRoutes.js'

dotenv.config();

const PORT = 3001;

const app = express();

app.use("/uploads",express.static("uploads"))

app.use(cors());

app.use(express.json());


mongoose
  .connect(
    process.env.MONGOURI
  )
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

app.use('/user',userRouter)
app.use('/books',bookRoute);





