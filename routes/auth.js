const express = require("express")
const router = express.Router()
const passport = require('passport')


//auth google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }) //layout is an object
)

//google auth callback
router.get('/google/callback', passport.authenticate('google',{ failureRedirect: '/' }),
(req, res)=> {
  // Successful authentication, redirect home.
  res.redirect('/dashboard');
});

//logout user
 
router.get('/logout', (req, res, next) => {
    /*req.logout()
    res.redirect('/')*/ //not working since version 0.6.0
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})

module.exports = router