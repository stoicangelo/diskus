var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/diskusDB', {useNewUrlParser: true,  useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.connection.on('error', ()=>{console.error('There was an errror connecting')}).once('open', ()=>{ console.log('DB connected to diskus application')});

module.exports = mongoose;