'use strict';

module.exports = function(_,passport,User){
    return {
        setRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
           
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);

            router.post('/', User.LoginValidation, this.postLogin);
            router.post('/signup', User.SignUpValidation, this.postSignUp)
        },
        indexPage: function(req, res){
            const errors = req.flash('error');
            return res.render('index', {title: 'Footballkik | Login', messages: errors, hasErrors: errors.length > 0});
        },
        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect:'/',
            failureFlash: true
        }),

        getSignUp: function(req, res){
            const errors = req.flash('error');
            return res.render('signup', {title: 'Footballkik | SignUp', messages: errors, hasErrors: errors.length > 0});
        },
        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email'
        }),
        getGoogleLogin: passport.authenticate('google', {
            //scope: ['profile','email']
            scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
        }),
        facebookLogin: passport.authenticate('facebook', {
           successRedirect: '/home',
           failureRedirect: '/signup',
           failureFlash: true
        }),
        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
         })
    }
}