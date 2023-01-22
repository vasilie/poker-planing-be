console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} else {
  require("dotenv").config({ path: ".env.development" });
}

var app = require('http').createServer()

var io = module.exports.io = require("socket.io")(app, { cors: {
  origin: `${process.env.APP_URL}:${process.env.SOCKET_PORT}`,
  methods: ["GET", "POST"],
  }
});

const SocketManager = require('./SocketManager')
setInterval(function(){
  console.log(process.env.NODE_ENV);
}, 1000)

io.on('connection', SocketManager)

app.listen(process.env.SOCKET_PORT, ()=> {
  console.log('connected on port: '+ process.env.SOCKET_PORT);
})