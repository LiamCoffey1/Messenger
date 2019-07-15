const CONSTANTS = require( "./Constants");

const io = require('socket.io')();

let names = new Set();
let messages = new Set();

io.on('connection', (client) => {

  client.on('subscribeToServer', (interval) => {
    console.log('client is subscribing to server with interval ', interval);
    setInterval(() => {
      let bundle = {
        users: [...names],
        messages: [...messages]
      };
      client.emit('bundle', bundle);
    }, interval);
  });

  client.on('set', (nickname, cb) => {
    const {
      NICKNAME_MAX_LENGTH : maxChars,
      NICKNAME_MIN_LENGTH : minChars
    } = CONSTANTS;
    if(names.has(nickname)) {
      cb("Name is already taken!");
    } else if(nickname.length < minChars) {
      cb("Nickname is too short.");
    } else if (nickname.length > maxChars) {
      cb("Nickname is too long.");
    } else {
      names.add(nickname);
      pushMessage({message : (nickname + " has joined the chat")}, 'notification');
      cb("success");
    }
  });

  client.on('remove', (nickname) => {
    pushMessage({message: (nickname + " has left the chat")}, 'notification');
    names.delete(nickname);
  });
  client.on('message', (params) => {
    pushMessage(params, 'message');
  });
});

function pushMessage(message, type) {
  let date  = new Date();
  let day = new Date().getDay();
  let paddedMinute = (date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes()));
  let paddedHour = (date.getHours() > 9 ? date.getHours() : ('0' + date.getHours()));
  message.timestamp = CONSTANTS.WEEKDAYS_SHORTHAND[day] + ' ' + paddedHour + ':' + paddedMinute;
  message.type = type;
  messages.add(message);
}

io.listen(CONSTANTS.PORT);
console.log('listening on port ', CONSTANTS.PORT);
