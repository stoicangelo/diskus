const mgoose = require('../config/db');
const Schema = mgoose.Schema;

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


var Group = mgoose.model('Group', groupSchema);

module.exports = {
    Group : Group
}