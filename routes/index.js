var express = require('express');
var router = express.Router();
var ChatUser = require('../models/group-model').ChatUser;
var Group = require('../models/group-model').Group;
var GroupMessage = require('../models/group-model').GroupMessage;
var socketAPI = require('../config/socket.js');

//this is going to be dynamic and fetched as a socket event parameter
const groupName = 'tester';


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
router.get('/', function(req, res, next) {
  console.log('hit esheche');
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

router.post('/set-user', function(req, res) {
  var usrnm = req.body.username;
  ChatUser.findOne({username : usrnm}).then((row)=>{
    if(!row){
      var usr = new ChatUser();
      usr.username = usrnm;
      usr.save().then(()=>{
        console.log('notun User insert hoye geche');
        res.json({ username : usrnm});
      }).catch(function(err){
        console.error('error occured while inserting username in db ::: '+err);
      });
    }
    else{ 
      console.log('username already exists. insert ar korlam na');
      res.end();
    }
  }).catch((err)=>{ console.log('error occured while searching for username ::: '+err)});
  //res.json({ username : usrnm});
});

module.exports = router;