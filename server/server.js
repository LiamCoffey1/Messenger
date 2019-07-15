const io = require('socket.io')();

let names = new Set();
let messages = new Set();



io.on('connection', (client) => {

  client.on('subscribe', function(room) {
    console.log('joining room', room);
    client.join(room);
    setInterval(() => {
        console.log('sending room post', 1);
        client.in(1).emit('conversation private post', {

        });
      }, 1000);
  });


  client.on('subscribeToNamesList', (interval) => {
    console.log('client is subscribing to names with interval ', interval);
    setInterval(() => {
      client.emit('timer', [...names]);
    }, interval);
  });
  client.on('subscribeToMessages', (interval) => {
    console.log('client is subscribing to messages with interval ', interval);
    setInterval(() => {
      client.emit('messages', [...messages]);
    }, interval);
  });


  client.on('set', (nickname, cb) => {
    if(names.has(nickname)) {
      cb("Name is already taken!");
    } else if(nickname === "") {
      cb("Nickname is too short.");
    } else if (nickname.length > 12) {
      cb("Nickname is too long.");
    } else {
      names.add(nickname);
      pushMessage({message : (nickname + " has joined the chat"), name: 'none'}, 'notification');
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
  let weekday = new Array(7);
  weekday[0] =  "Sun";
  weekday[1] = "Mon";
  weekday[2] = "Tue";
  weekday[3] = "Wed";
  weekday[4] = "Thur";
  weekday[5] = "Fri";
  weekday[6] = "Sat";
  let day = new Date().getDay();
  let paddedMinute = (date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes()));
  let paddedHour = (date.getHours() > 9 ? date.getHours() : ('0' + date.getHours()));
  message.timestamp = weekday[day] + ' ' + paddedHour + ':' + paddedMinute;
  message.type = type;
  messages.add(message);
}

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
