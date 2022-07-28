
exports.seed = async function(knex) {
  
  await knex('friends').truncate()
  await knex('friends').insert([
    { name: 'bill' },
    { name: 'bob' },
    { name: 'bradly' },
    { name: 'braxton' },
    { name: 'butcher' }
  ]);
};
