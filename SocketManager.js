const io = require('./app.js').io

var usernames = {};

const updateUsernames = () => {
  for (const property in usernames) {
    io.in(property).emit("usernames", usernames[property]);
  }
}

const removeUsername = (socket) => {
  const roomUsernames = usernames[socket.roomId];
  if (socket && roomUsernames){
    roomUsernames.splice(roomUsernames.findIndex(index => index.username == socket.username), 1);
  }
}

module.exports = function(socket){
  socket.on("new user", function(data, callback){
    console.log("socket manager data" + JSON.stringify(data));
    // callback(true);
    socket.username = data.username;
    socket.roomId = data.roomId;
    // socket.color = data.color;
    if (usernames[data.roomId]){
      usernames[data.roomId].push({ username: socket.username });
    } else {
      usernames[data.roomId] = [{ username: socket.username }];
    }

    socket.join(socket.roomId);
    updateUsernames();
  });

  socket.on("disconnect",function(data){
      removeUsername(socket);
      updateUsernames();
  });
}
