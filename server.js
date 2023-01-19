const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require('cors')

const SocketManager = require('./SocketManager');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const secret = "t114t1t4g;2`'44123#$$@!@#@#ULTRABOBANODMAMUJEPRISODAMULUPIDVASAMARAdabisiotiso";
const flash = require("express-flash");
const session = require("session");

const initializePassport = require("./passport-config");
initializePassport({
  passport,
  username => await User.findOne({username}).lean(),
  id
});
app.use(flash());
app.use(cors());
app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
// app.use(cors());

var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

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

app.use("/cookies", (req, res) => {
  const dataToSecure = {
    dataToSecure: "This is the secret data in the cookie.",
  };

  res.cookie("secureCookie", JSON.stringify(dataToSecure), {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    expires: dayjs().add(30, "days").toDate(),
  });

  res.send("Hello.");
});

app.options('/api/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
}));

app.post("/api/login", cors(corsOptions), async (req, res) => {



  // const { username, password } = req.body;

  // const user = await User.findOne({username}).lean();
  // if (!user) return res.json({status: "error", error: "Invalid username/password"});

  // console.log(user.username);
  // console.log(user.password);

  // if (!user) return res.json({status: "error", error: "Invalid username/password"});

  // if (await bcrypt.compare(password, user.password)){
  //   const token = jwt.sign({ id: user._id, username: user.username }, secret)
  //   return res.json({status: "ok", data: token})
  // } else {
  //   return res.json({status: "error", error: "Invalid username/password"});
  // }

})


app.post("/api/register", async (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;
  console.log(req);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      username,
      password: hashedPassword,
      email, 
      firstName,
      lastName
    })
    res.json({status: "ok"})

  } catch (error) {
    console.log(error);
    return res.json({status: "error"});
  }
  
})

server.listen(PORT, ()=> {
  console.log('connected on port: '+ PORT);
})