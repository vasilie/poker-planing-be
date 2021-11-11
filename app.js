var app = require('http').createServer()
var io = module.exports.io = require("socket.io")(app, { cors: {
  origin: "http://localhost:42069",
  methods: ["GET", "POST"],
  }
})

const PORT = process.env.PORT || 3231
const SocketManager = require('./SocketManager')

io.on('connection', SocketManager)

app.listen(PORT, ()=>{
  console.log('connected on port: '+ PORT);
})