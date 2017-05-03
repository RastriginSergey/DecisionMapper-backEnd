const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const http = require('http');

function byName(req, res, next) {
    const {name} = req.query;
    P.getPokemonsList()
        .then(response => {
            const matches = response.results.filter(item => {
                const pattern = new RegExp(`^${name.toLowerCase()}`);
                return pattern.test(item.name.toLowerCase());
            });

            res.json({pokemons: matches});
        }).catch(error => next(error));
}

function all(req, res, next) {
    const {limit, offset} = req.query;
    const interval = {
        limit: limit - 1 || 1,
        offset: offset || 0
    };

    P.getPokemonsList(interval)
        .then(response => {
            const pokemons = response.results.map(item => P.getPokemonByName(item.name));
            Promise.all(pokemons).then(result => res.json({result: result, count: response.count}))
        }).catch(error => next(error));
}

function byType(req, res, next) {
    const {type} = req.query;
    if (type) {
        P.getTypeByName(type)
            .then(response => {
                res.json({pokemons: response.results})
            }).catch(error => next(error));
    } else {
        res.status(403).send('Provide "type" parameter');
    }
}

function types(req, res, next) {
    P.getTypesList()
        .then(response => {
            res.json({types: response.results})
        }).catch(error => next(error));
}



module.exports = {
    byName,
    byType,
    all,
    types
};