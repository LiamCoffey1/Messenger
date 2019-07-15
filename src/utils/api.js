let socket;


function setSocket(connection) {
  socket = connection;
}

function pushMessage(message, name) {
  socket.emit('message', {message, name});
}

function setNickname(name) {
  return new Promise(function(resolve, reject) {
    return socket.emit('set', name, (response) => {
      if(response === "success") resolve("test");
      else reject(response);
    });
  });
}

function removeUser(name) {
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