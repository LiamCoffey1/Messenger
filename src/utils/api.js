import openSocket from "socket.io-client";

let socket;

let room = null;

function joinRoom(roomId) {
  socket.emit('subscribe', roomId);

  socket.on('conversation private post', function(data) {
    console.log("recieved");
  });
}
function setSocket(connection) {
  socket = connection;
  console.log(socket);
}

function pushMessage(message, name) {
  socket.emit('message', {message, name});
}



function setNickname(name) {
  console.log(socket);
  return new Promise(function(resolve, reject) {
    return socket.emit('set', name, (response) => {
      if(response === "success") resolve("test");
      else reject(response);
    });
  });
}

function removeUser(name) {
  console.log(name);
  socket.emit('remove', name);
}

function subscribeToNamesList(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToNamesList', 1000);
}

function unSubscribeListeners() {
  socket.removeAllListeners();
}

function subscribeToMessage(cb) {
  socket.on('messages', timestamp => cb(null, timestamp));
  socket.emit('subscribeToMessages', 1000);
}

export {
  joinRoom,
  subscribeToNamesList,
  unSubscribeListeners,
  setNickname,
  pushMessage,
  setSocket,
  subscribeToMessage,
  removeUser
};