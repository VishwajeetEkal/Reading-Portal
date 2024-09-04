
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user_model');

passport.use(new GoogleStrategy({
  clientID: '614086975345-7khpfkharqvbbd4vn55u4thkaemgunc9.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:8080/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
    // Here you'd typically search your database for the user.
    // For this example, we'll just simulate it with a find-or-create logic.
    //console.log(profile)
    try {
      let user = await User.findOne({ googleId: profile.id });
  
      if (!user) {
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          role: 'user',
          username: "-",
        password: "-",
        securityQuestion1 : "-",
        securityAnswer1 : "-",
        securityQuestion2 : "-",
        securityAnswer2: "-"
        });
  
        await user.save();
      }
      const token = jwt.sign({ userId: user._id }, 'mysecretkey170904', { expiresIn: '1h' });
      return done(null, {profile,token});
    } catch (err) {
      return done(err, null);
    }
}));
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
