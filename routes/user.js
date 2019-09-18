const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();


router.get('/signup', (req, res, next) => {
    res.render('users/signup')
});

router.post('/signup', (req, res, next) => {
    const salt = bcrypt.genSaltSync(10)
    req.body.password = bcrypt.hashSync(req.body.password, salt)

    User.create(req.body)
        .then(user => {
            req.session.currentUser = user
            res.status(201).redirect('/')
        })
        .catch(e => res.status(500).send(e))
});

router.get('/login', (req, res, next) => {
    res.render('users/login')
})

router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user && bcrypt.compareSync(req.body.password, user.password)) req.session.currentUser = user;
            res.redirect('/')
        })
})

router.post('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
})

router.get('/secret', (req, res, next) => {
    if (req.session.currentUser) res.render('users/secret', { user: req.session.currentUser })
    else res.redirect('/')
})

module.exports = router