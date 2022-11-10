var app = require('http').createServer()
var io = module.exports.io = require("socket.io")(app, { cors: {
  // origin: "http://vasilie.net:42069",
  origin: "localhost:42069",
  methods: ["GET", "POST"],
  }
});

const PORT = process.env.PORT || 3231
const SocketManager = require('./SocketManager')

io.on('connection', SocketManager)

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  res.json({status: 'ok'})
})

app.listen(PORT, ()=>{
  console.log('connected on port: '+ PORT);
})