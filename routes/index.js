var express = require('express');
var router = express.Router();
var ChatUser = require('../models/group-model').ChatUser;
var Group = require('../models/group-model').Group;
var GroupMessage = require('../models/group-model').GroupMessage;
var socketAPI = require('../config/socket.js');

const groupName = 'tester';
// Group.findOne({name : groupName}).then((err,data) => {
//   console.log(data);
//   if(!data){
//     var testerGrp = new Group({name : groupName, categories : ['dev']});
//     testerGrp.save((err)=>{
//       if(err)
//         console.log('error occured while saving tester group ::: '+err);
//       else
//         console.log('tester group CREATED now!');
//     });
//   }
//   else
//     console.log('tester groeup already ache. No need to create');
// });

socketAPI.io.on('connection', function(socket){
  
  console.log('socket online from inside index.js');
  socket.on('chat-sent', function(param) {
  
    console.log('chat sent received');
    //this is going to be dynamic and fetched as a socket event parameter
    var groupName = 'tester'; 

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
        grp.messages.push({user: usr._id, text : param.message});
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
  res.render('index', { title: 'Diskus' });
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