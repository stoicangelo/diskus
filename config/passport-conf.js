const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ChatUser = require('../models/user-model').ChatUser;

//TO-DO ::: add messages to callbacks (calls to done on failing, not on error)
passport.use(new LocalStrategy(
  function(username, password, done) {
    ChatUser.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
	ChatUser.findById(id, function(err, user) {
		done(err, user);
	});
});

module.exports = passport;