const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie')
const Celebrity = require('../models/Celebrity')

router.get('/', (req, res, next) => {
    Movie.find({})
        .then(movies => {
            res.render('movies/index', { movies });
        })
        .catch(e => next(e))
});

router.get('/details/:id', (req, res, next) => {
    Movie.findById(req.params.id).populate('director')
        .then(movie => {
            res.render('movies/show', { movie });
        })
        .catch(e => next(e))
});

router.get('/new', async(req, res, next) => {
    let directors = await Celebrity.find()
    res.render('movies/create', { directors })
})

router.post('/', (req, res, next) => {
    Movie.create(req.body)
        .then(movie => {
            movie.save()
            res.redirect('/movies')
        })
        .catch(e => res.redirect('/movie/new'))
});

router.post('/:id/delete', (req, res, next) => {
    Movie.findByIdAndDelete(req.params.id)
        .then(_ => {
            res.redirect('/movies');
        })
        .catch(e => next(e))
});


router.get('/:id/edit', async(req, res, next) => {
    let directors = await Celebrity.find()
    Movie.findById(req.params.id).populate('director')
        .then(movie => {
            res.render('movies/edit', { movie, directors })
        })
        .catch(e => next(e))
});

router.post('/:id', (req, res, next) => {
    Movie.findByIdAndUpdate(req.params.id, req.body)
        .then(_ => {
            res.redirect('/movies')
        })
        .catch(e => next(e))
});

module.exports = router;