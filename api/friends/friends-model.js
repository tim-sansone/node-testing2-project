const db = require('../../data/db-config');


function getAll() {
    return db('friends');
}

function getById(id) {
    return db('friends').where({ id }).first();
}

async function create(friend) {
    const [id] = await db('friends').insert(friend);
    return getById(id);
}

async function update(id, friend) {
    await db('friends').update(friend).where({ id });
    return getById(id);
}

async function remove(id) {
    const result = await getById(id);
    await db('friends').delete().where({ id });
    return result;
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
}
