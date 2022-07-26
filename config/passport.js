const  GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')



const User = require('../models/User')

module.exports = function(passport){

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  //we are dealing with mongoose so we use async
  async(accessToken, refreshToken, profile, done) =>{
   /* User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });*/
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value

    }
    try {
        let user = await User.findOne({ googleId: profile.id })

        if (user){
            done(null, user);

        }
        else{
            user = await User.create(newUser)
            done(null, user)
        }
        
    } catch (error) {
        
    }
    console.log(profile)
  }
));
/*passport.serializeUser((user, cb) => {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
  passport.deserializeUser((user, cb) =>{
    process.nextTick(function() {
      return cb(null, user);
    });
  });*/

//To maintain a login session

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}