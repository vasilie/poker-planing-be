const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const SocketManager = require('./SocketManager');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mongoose = require("mongoose");
const User = require("./models/user");

var io = module.exports.io = require("socket.io")(server, { cors: {
  // origin: "http://vasilie.net:42069",
  origin: "localhost:42069",
  methods: ["GET", "POST"],
  }
});

const PORT = process.env.PORT || 3231
const uri = "mongodb+srv://vasilie:Mongodbvaske.1@cluster0.wcyxqmf.mongodb.net/?retryWrites=true&w=majority"

async function connectToDB() {
  try {
    await mongoose.connect(uri);
    console.log("connected to MongoDB");
  } catch (e){
    console.error(e);
  }
}''

io.on('connection', SocketManager)
connectToDB();

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  res.json({status: 'ok'})
})

server.listen(PORT, ()=> {
  console.log('connected on port: '+ PORT);
})