const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes= require('./routes/userRoutes');

const app = express();

// used to load env variable from a '.env' file
require("dotenv").config();

//configure middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth',userRoutes);

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log("db connected successfully");
}).catch((err)=>{
  console.log(err);
});

//starting server on port 5000
const server = app.listen(process.env.PORT, ()=>{
  console.log(`Server started on Port ${process.env.PORT}`);
})