const { GAME_STATE_CHOOSING_CARDS, GAME_STATE_REVEALING_CARDS, GAME_STATE_ALL_CARDS_CHOOSEN, GAME_STATE_NEW_ROUND, NEW_CARD_VALUE } = require('./constants');
const io = require('./server.js').io

var usernames = {};

const updateUsernames = socket => {
  io.in(socket.roomId).emit("usernames", usernames[socket.roomId]);
}

const removeUsername = (socket) => {
  const roomUsernames = usernames[socket.roomId];
  if (socket && roomUsernames){
    roomUsernames.splice(roomUsernames.findIndex(index => index.username == socket.username), 1);
  }
}

const clearCardValues = (socket) => {
  const roomUsernames = usernames[socket.roomId];
  if (socket && roomUsernames){
    roomUsernames.forEach(username=> username.cardValue = null);
  }
}

const calculateAverage = (socket) => {
  const cardValuesAgreement = {};
  const cardValuesAgreementArray = [];

  let maxPercentage = 0;
  let valuesSum = 0;

  const roomUsernames = usernames[socket.roomId];
  const average = roomUsernames.reduce((prev, current) => prev + current.cardValue, 0) / roomUsernames.length;

  roomUsernames.forEach(({cardValue}) => {
    valuesSum++;
    if (cardValuesAgreement[cardValue]){
      cardValuesAgreement[cardValue] += 1;
    } else {
      cardValuesAgreement[cardValue] = 1;
    }
  })

  for (const prop in cardValuesAgreement) {
   let percentage = cardValuesAgreement[prop] / valuesSum * 100;
   if (percentage > maxPercentage){
     maxPercentage = percentage;
   }
    cardValuesAgreementArray.push({key: prop, value: cardValuesAgreement[prop], percentage})
  }
  console.log(cardValuesAgreementArray);

  return { average, cardValuesAgreement: cardValuesAgreementArray, maxPercentage };
}

const checkIfAllCardsChoosen = (socket) => {
  return usernames[socket.roomId].every(el => el.cardValue !== null);
}

module.exports = function(socket){
  socket.on("new user", function(data, callback){
    console.log("socket manager data" + JSON.stringify(data));
    // callback(true);
    socket.username = data.username;
    socket.roomId = data.roomId;
    socket.cardStyle = data.cardStyle;
    // socket.color = data.color;
    
    if (usernames[data.roomId]){
      usernames[data.roomId].push({ username: socket.username, cardValue: null, cardStyle: socket.cardStyle });
    } else {
      usernames[data.roomId] = [{ username: socket.username, cardValue: null, cardStyle: socket.cardStyle }];
    }

    socket.join(socket.roomId);
    updateUsernames(socket);
    io.in(socket.roomId).emit(GAME_STATE_CHOOSING_CARDS, true);
  });

  socket.on(NEW_CARD_VALUE, function(data){
    usernames[socket.roomId].find(username => username.username === socket.username).cardValue = data.cardValue;
    if (checkIfAllCardsChoosen(socket)){
      io.in(socket.roomId).emit(GAME_STATE_ALL_CARDS_CHOOSEN, true);
    } else {
      io.in(socket.roomId).emit(GAME_STATE_CHOOSING_CARDS, true);
    }
    updateUsernames(socket);
  });

  socket.on(GAME_STATE_REVEALING_CARDS, function(){
    const data = calculateAverage(socket);
    io.in(socket.roomId).emit(GAME_STATE_REVEALING_CARDS, data );
  });

  socket.on(GAME_STATE_NEW_ROUND, function(){
    clearCardValues(socket);
    updateUsernames(socket);
    io.in(socket.roomId).emit(GAME_STATE_NEW_ROUND, true);
  });

  socket.on("disconnect",function(data){
      removeUsername(socket);
      updateUsernames(socket);
  });
}
