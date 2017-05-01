const passport = require('passport');
const User = require('../models/user');
const {secret} = require('../config');
const {Strategy, ExtractJwt} = require('passport-jwt');
const FacebookStrategy = require('passport-facebook');
const LocalStrategy = require('passport-local');
const {facebookSecret, facebookAppId} = require('../config');


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
        clientID: facebookAppId,
        clientSecret: facebookSecret,
        callbackURL: "http://localhost:3000/facebook/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({facebookId: profile.id}, function (err, user) {
            return cb(err, user);
        });
    });

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: secret
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
