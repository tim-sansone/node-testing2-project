
exports.up = function(knex) {
    return knex.schema.createTable('friends', tbl => {
        tbl.increments('id');
        tbl.varchar('name').unique().notNullable();
    })
};


exports.down = function(knex) {
    return knex.schema.dropTableIfExists('friends');
};
