const db = require('../../data/db-config');
const Friends = require('./friends-model');
const request = require('supertest');
const server = require('../server');

test('sanity check', () => {
    expect(true).toBe(true);
});

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

beforeEach(async () => {
    await db.seed.run();
});

afterAll(async () => {
    await db.destroy();
});

describe('friends-model', () => {
    test('getAll', async () => {
        let result = await Friends.getAll();
        expect(result).toHaveLength(5);
        expect(result[0]).toMatchObject({ name: 'bill' });
        expect(result[0]).toHaveProperty('id');
    });

    test('getById', async () => {
        let result = await Friends.getById(5);
        expect(result).toEqual({ id: 5, name: 'butcher' });

        result = await Friends.getById(999);
        expect(result).not.toBeDefined();
    });

    test('create', async () => {
        let result = await Friends.create({ name: 'bryan' });
        expect(result).toHaveProperty('id', 6);
        expect(result).toMatchObject({ name: 'bryan' });

        result = await Friends.getAll();
        expect(result).toHaveLength(6);
    });

    test('update', async () => {
        let result = await Friends.update(3, { name: 'brad' });
        expect(result).toEqual({ id: 3, name: 'brad' });

        result = await Friends.getAll();
        expect(result).toHaveLength(5);

        result = await Friends.update(999, { name: 'clarence' });
        expect(result).not.toBeDefined();
    });

    test('delete', async () => {
        let result = await Friends.remove(4);
        expect(result).toEqual({ id: 4, name: 'braxton' });

        result = await Friends.getAll();
        expect(result).toHaveLength(4);

        result = await Friends.remove(4);
        expect(result).not.toBeDefined();
    })
})

describe('friends-router', () => {
    test('GET /api/friends', async () => {
        let result = await request(server).get('/api/friends');
        expect(result.body).toHaveLength(5);
        expect(result.body[0]).toMatchObject({ name: 'bill' });
        expect(result.body[0]).toHaveProperty('id');
    })

    test('GET /api/friends/:id', async () => {
        let result = await request(server).get('/api/friends/5')
        expect(result.body).toEqual({ id: 5, name: 'butcher' });

        result = await request(server).get('/api/friends/999')
        expect(result.body).toMatchObject({ message: 'friend does not exist' });
        expect(result.status).toBe(404);
    })

    test('POST /api/friends', async () => {
        let result = await request(server).post('/api/friends').send({ name: 'bryan' })
        expect(result.body).toHaveProperty('id', 6);
        expect(result.body).toMatchObject({ name: 'bryan' });
        expect(result.status).toBe(201);

        result = await request(server).get('/api/friends');
        expect(result.body).toHaveLength(6);

        result = await request(server).post('/api/friends').send({ })
        expect(result.body).toMatchObject({ message: 'please include a name' });
        expect(result.status).toBe(404);
    })

    test('PUT /api/friends', async () => {
        let result = await request(server).put('/api/friends/3').send({ name: 'brad' });
        expect(result.body).toEqual({ id: 3, name: 'brad' });

        result = await Friends.getAll();
        expect(result).toHaveLength(5);

        result = await request(server).put('/api/friends/3').send({ })
        expect(result.body).toMatchObject({ message: 'please include a name' });
        expect(result.status).toBe(404);

        result = await request(server).put('/api/friends/999').send({ name: 'clarence' });
        expect(result.body).toMatchObject({ message: 'friend does not exist' });
        expect(result.status).toBe(404);
    })

    test('DELETE /api/friends/:id', async () => {
        let result = await request(server).delete('/api/friends/4')
        expect(result.body).toEqual({ id: 4, name: 'braxton' });

        result = await Friends.getAll();
        expect(result).toHaveLength(4);

        result = await request(server).delete('/api/friends/4')
        expect(result.body).toMatchObject({ message: 'friend does not exist' });
        expect(result.status).toBe(404);
    })
})
