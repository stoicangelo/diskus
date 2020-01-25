const mgoose = require('../config/db');

// var groupChatSchema = new mgoose.Schema()
var userSchema = new mgoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        maxlength : [15, 'Too long username. Max 15 allowed']
    },
    name : String
});

var ChatUser = mgoose.model('ChatUser', userSchema);

module.exports = ChatUser;