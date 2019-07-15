let socket;


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

function subscribeToServer(cb) {
  socket.on('bundle', timestamp => cb(null, timestamp));
  socket.emit('subscribeToServer', 1000);
}

function unSubscribeListeners() {
  socket.removeAllListeners();
}


export {
  subscribeToServer,
  unSubscribeListeners,
  setNickname,
  pushMessage,
  setSocket,
  removeUser
};