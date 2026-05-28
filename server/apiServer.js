//for https cert &create https 
const https = require("https");
const fs = require("fs");

// import the express module
const express = require('express');

// Define the port number the server will listen on
const PORT = 3000;

// import mongoose
const mongoose = require('mongoose');

// cors prevents browser blocks request
const cors = require("cors");

//import route
const authRouter = require('../server/routes/auth');

// create an instance of an express application : it gives us starting point
const app = express();


// middleware to register or mount route
app.use(express.json());
app.use(cors());

// console message
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(authRouter);

// create certificate automatically

const options = {
  key: fs.readFileSync("./cert/localhost-key.pem"),
  cert: fs.readFileSync("./cert/localhost.pem")
};

// this for create https server//

https.createServer(options, app).listen(3000, () => {
  console.log("HTTPS Server running on https://localhost:3000");
});

 //this for andriod emulator test run support for http 
// app.listen(3000, "0.0.0.0", () => {
//   console.log("Server running on http://localhost:3000");
// });


//Mongo DB connection string
// const DB = "mongodb://jenacqu_db:CQUmob269@ac-thtkcpc-shard-00-00.exzhkk6.mongodb.net:27017,ac-thtkcpc-shard-00-01.exzhkk6.mongodb.net:27017,ac-thtkcpc-shard-00-02.exzhkk6.mongodb.net:27017/?replicaSet=atlas-6dy2ru-shard-0&ssl=true&authSource=admin"
//const DB =  "mongodb+srv://jenacqu_db:CQUmob269@cluster0.exzhkk6.mongodb.net/travelsekai?retryWrites=true&w=majority";
const DB = "mongodb://jenacqu_db:CQUmob269@ac-thtkcpc-shard-00-00.exzhkk6.mongodb.net:27017,ac-thtkcpc-shard-00-01.exzhkk6.mongodb.net:27017,ac-thtkcpc-shard-00-02.exzhkk6.mongodb.net:27017/travelsekai?replicaSet=atlas-6dy2ru-shard-0&ssl=true&authSource=admin";

mongoose.connect(DB)
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

//start the server and listen on port

//After https certif I comment this
// app.listen(PORT,"0.0.0.0" , ()=>{
//     // log the number
//     console.log(`server is running on the port ${PORT}`);
// });