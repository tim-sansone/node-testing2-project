const express = require('express');
const router = express.Router();
const Friends = require('./friends-model');
const { checkIfExists, checkPayload } = require('./friends-middleware')

router.get('/', (req, res, next) => {
    Friends.getAll()
        .then(friends => {
            res.json(friends)
        })
        .catch(next)
});

router.get('/:id', checkIfExists, (req, res, next) => {
    res.json(req.friend)
});

router.post('/', checkPayload, (req, res, next) => {
    Friends.create(req.body)
        .then(friend => {
            res.status(201).json(friend)
        })
        .catch(next)
});

router.put('/:id', checkIfExists, checkPayload, (req, res, next) => {
    Friends.update(req.params.id, req.body)
        .then(friend => {
            res.json(friend)
        })
        .catch(next)
});

router.delete('/:id', checkIfExists, (req, res, next) => {
    Friends.remove(req.params.id)
        .then(friend => {
            res.json(friend);
        })
        .catch(next)
});

module.exports = router;
