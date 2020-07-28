const mgoose = require('../config/db');
const Schema = mgoose.Schema;


var userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        maxlength : [15, 'Too long username. Max 15 allowed']
    },
    name : String,
    password : {
        type : String,
        required : true,
        minlength : [5, 'Too short password'],
        maxlength : [18, 'Too long password']
    }
});

var ChatUser = mgoose.model('ChatUser', userSchema);

module.exports = {
    ChatUser : ChatUser
}