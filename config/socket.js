const socket = require('socket.io');
const io = socket();

let socketapi = {}
// io.on('connection', function(socket){
//     console.log("a user is connected. socket");
// });

socketapi.io = io



module.exports = socketapi;