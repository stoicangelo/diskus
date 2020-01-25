var express = require('express');
var router = express.Router();
var ChatUser = require('../models/group-model');

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
        console.log('insert hoye geche');
        res.json({ username : usrnm});
      }).catch(function(err){
        console.error('error occured while inserting username in db ::: '+err);
      });
    }
    else{ 
      console.log('username already exists. insert ar korlam na');
    }
  }).catch((err)=>{ console.log('error occured while searching for username ::: '+err)});
  res.end();
  //res.json({ username : usrnm});
});

module.exports = router;