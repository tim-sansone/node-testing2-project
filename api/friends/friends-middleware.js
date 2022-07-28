const Friends = require('./friends-model')

function checkIfExists(req, res, next) {
    Friends.getById(req.params.id)
        .then(friend => {
            if(friend == null){
                next({ status: 404, message: 'friend does not exist' });
                return;
            }
            req.friend = friend;
            next();
        })
        .catch(next)
}

function checkPayload(req, res, next) {
    const { name } = req.body;
    if(!name || typeof name !== 'string' || name.trim() === ''){
        next({ status: 404, message: 'please include a name' })
        return
    }
    next()
}

module.exports = {
    checkIfExists,
    checkPayload
}
