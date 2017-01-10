var LocalStrategy = require('passport-local').Strategy;

// load all models
var User = require('../app/models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // LOCAL SIGNUP NAMED STRATEGY
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // pass back entire request to callback
        },
        function(req, email, password, done) { // callback 

            // Checking if the user trying to signup already exists
            User.findOne({ "$or": [{ 'local.email': email }, { 'local.userName': req.body.userName }] },
                function(err, user) {

                    // return errors if any
                    if (err) return done(err);

                    // if user already exists
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'UserName or Email already exists.'));
                    } else {
                        // if there is no user with that email - create one
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.firstName = req.body.firstName;
                        newUser.local.lastName = req.body.lastName;
                        newUser.local.role = 'user';
                        newUser.local.userName = req.body.userName;

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
        }));


    // LOCAL LOGIN NAMED STRATEGY
    passport.use('local-login', new LocalStrategy({
            usernameField: 'userName',
            passwordField: 'password',
            passReqToCallback: true // pass back entire request to callback
        },
        function(req, email, password, done) { // callback 

            // User trying to login should exists
            User.findOne({ 'local.userName': req.body.userName }, function(err, user) {

                // return errors if any
                if (err) return done(err);

                // User not found
                if (!user) return done(null, false, req.flash('loginMessage', 'User not found.'));

                // User found - password wrong
                if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong password.'));

                // all well , return user
                return done(null, user);
            });
        }));


};