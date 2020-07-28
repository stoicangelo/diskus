var express = require('express');
var router = express.Router();
const ChatUser = require('../models/user-model').ChatUser
// const passport = require('../config/passport-conf');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated} = require('../config/custom-middleware');

router.get('/login', forwardAuthenticated, (req, res, next) => {
    console.log('Login Page opens on request')
    res.render('login')
})

router.get('/registration', forwardAuthenticated, (req, res, next) => {
    console.log('Registration Page opens on request')
    res.render('registration')
})

router.post('/login', forwardAuthenticated, 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })
);

// router.post('/login', function(req, res, next) {
//     console.log(req.url);
//     passport.authenticate('local', function(err, user, info) {
//         console.log("authenticate");
//         console.log(err);
//         console.log(user);
//         console.log(info);
//     })(req, res, next);
// });

router.post('/signup', forwardAuthenticated, (req, res, next) => {
    const {username, password} = req.body
    ChatUser.findOne({username : username}, (existingUser, err) => {
        if (err) {
            console.log(err);
            res.render('registration', {message : 'Something went wrong'})
        }
        if (existingUser) {
            console.log(existingUser)
            res.render('registration', {message : 'username already exists. Pick another'})
        }
        var newUser = new ChatUser();
        newUser.username = username;
        newUser.password =  password;
        newUser.save((err)=> {
            if(err) {
                console.log(err);
                res.render('registration', {message : 'Something went wrong'});
            }
            console.log('user insert hoiya gelo');
        });
        res.redirect('/auth/login');
    })
});

router.get('/logout', ensureAuthenticated, (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports = router;