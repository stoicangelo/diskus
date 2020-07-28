var express = require('express');
var router = express.Router();
var ChatUser = require('../models/user-model').ChatUser;
var Group = require('../models/group-model').Group;
var socketAPI = require('../config/socket.js');
const {ensureAuthenticated, forwardAuthenticated} = require('../config/custom-middleware');

//this is going to be dynamic and fetched as a socket event parameter
const groupName = 'tester-group';


socketAPI.io.on('connection', function(socket){
  
  console.log('socket online from inside index.js');
  socket.on('chat-sent', function(param) {
    
  
    console.log('chat sent received'); 

    ChatUser.findOne({username : param.username}, (err,usr)=>{
      if(err || !usr){
        console.log('dont try to enter message with invalidi user ::: '+err);
        return;
      }
      console.log('printing the corresponding fetched user :: ' +usr);
      Group.findOne({name : groupName}, function(err,grp) {
        if(err){
          console.log(err);
          return;
        }
        console.log('printing the corresponding group :: '+grp);
        var mess = {sender: usr._id, text : param.message};
        console.log('THIS IS THE MESSAGE BEING INSERTED ::: '+JSON.stringify(mess));
        grp.messages.push(mess);
        grp.save((err)=>{
          if(err){
            console.log(err);
            return;
          }
          console.log('message inserted in group');
        });
      });
    });
    socket.emit('group-message-handled', { user : param.username, message : param.message});
  });
});

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  console.log('home page hit');
  var messageList = [];
  Group.findOne({name : groupName}, async function(err,grp) {
    if(err){
      console.log('gouranga ::: '+err);
      res.end();
      return;
    }
    for(var i=0;i<grp.messages.length; i++){
      var mess = grp.messages[i];
      console.log(mess);
      var usr = await ChatUser.findById(mess.sender);
      messageList.push({sendername : usr.username, text : mess.text});
    }
    console.log(messageList.length);
    res.render('index', { title: 'Diskus' , messages : messageList});
  });
  
});


module.exports = router;