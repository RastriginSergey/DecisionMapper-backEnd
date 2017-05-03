const passport = require('passport');
const User = require('../models/user');
const {Strategy, ExtractJwt} = require('passport-jwt');
const FacebookStrategy = require('passport-facebook');
const LocalStrategy = require('passport-local');


const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({email}, (err, user) => {
        if (err) {
            return done(err);
        }

        if (user) {
            // compare password with hashed password
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    return done(err);
                }

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        } else {
            return done(null, false);
        }

    });
});
const facebookLogin = new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({facebookId: profile.id}, function (err, user) {
            return cb(err, user);
        });
    });

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.SECRET
};

const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub, (err, user) => {
        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(facebookLogin);
