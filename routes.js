const Authentication = require('./controllers/authentication');
const PokemonController = require('./controllers/pokemon');
const passport = require('passport');
const passportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});
const requireFacebook = passport.authenticate('facebook', {session: false});

function routes(app) {
    app
        .post('/signup', Authentication.signup)
        .post('/signin', requireSignIn, Authentication.signin)
        .get('/facebook', requireFacebook)
        .get('/facebook/callback', requireFacebook, Authentication.signin)
        .get('/api/v1/pokemons/name', PokemonController.byName)
        .get('/api/v1/pokemons/type', PokemonController.byType)
        .get('/api/v1/pokemons/types', PokemonController.types)
        .get('/api/v1/pokemons', PokemonController.all)
        .get('/api/v1/favorite', requireAuth, PokemonController.getFavorites)
        .post('/api/v1/favorite', requireAuth, PokemonController.addFavorite)
        .delete('/api/v1/favorite', requireAuth, PokemonController.removeFavorite)
}

module.exports = routes;