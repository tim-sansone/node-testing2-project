const express = require('express');
const server = express();

const friendsRouter = require('./friends/friends-router');

server.use(express.json())
server.use('/api/friends', friendsRouter);

server.get('/', (req, res) => {
    res.status(200).json({ message: 'the server is up' })
})

server.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message || 'internal server error' })
})

module.exports = server;
