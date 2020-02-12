const mgoose = require('../config/db');
const Schema = mgoose.Schema;

var userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        maxlength : [15, 'Too long username. Max 15 allowed']
    },
    name : String
});

var groupSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    categories : [String],
    messages : [{
        sender : { type : Schema.Types.ObjectId, ref : 'ChatUser'},
        text : String
    }]
});


var ChatUser = mgoose.model('ChatUser', userSchema);
var Group = mgoose.model('Group', groupSchema);

module.exports = {
    ChatUser : ChatUser,
    Group : Group
}