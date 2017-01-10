// load all models
var User = require('../app/models/user');


module.exports = function(app, passport) {

    // HOME PAGE
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load home page
    });



    // LOGIN - show login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));



    // SIGNUP - show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));



    // PROFILE PAGE
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // LOGOUT 
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


};






/********* VALIDATE LOGGED IN USER *************/
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session - carry on
    if (req.isAuthenticated())
        return next();

    // if user is not authenticated - redirect to the home page
    res.redirect('/');
}