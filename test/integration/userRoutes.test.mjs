import { expect,use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app.js';
import User from '../../models/User.js';

const chai = use(chaiHttp);

describe('User Routes Integration Tests', () => {
    before(async () => {
        await User.destroy({ where: {}, truncate: true });
    });

    it('should create a new user via POST /users', async () => {
        const user = { name: 'John Doe', email: 'john@example.com', password: '123456' };
        const res = await chai.request.execute(app).post('/users').send(user);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('email').eql('john@example.com');
    });

    it('should retrieve a user by ID via GET /users/:id', async () => {
        const user = { name: 'Jane Doe', email: 'jane@example.com', password: 'abcdef' };
        const createdUser = await chai.request.execute(app).post('/users').send(user);
        const res = await chai.request.execute(app).get(`/users/${createdUser.body.id}`);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('email').eql('jane@example.com');
    });

    it('should return 404 for non-existing user via GET /users/:id', async () => {
        const res = await chai.request.execute(app).get('/users/999');
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error').eql('User not found');
    });
});
