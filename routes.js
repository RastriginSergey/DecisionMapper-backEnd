const Authentication = require('./controllers/authentication');
const passport = require('passport');
const passportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});
const requireFacebook = passport.authenticate('facebook', {session: false});

function routes(app) {
    app
        .get('/', requireAuth, function (req, res, next) {
            res.send('haha its work')
        })
        .post('/signup', Authentication.signup)
        .post('/signin', requireSignIn, Authentication.signin)
        .get('/facebook', requireFacebook)
        .get('/facebook/callback', requireFacebook, Authentication.signin);
}

module.exports = routes;