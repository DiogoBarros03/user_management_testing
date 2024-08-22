import { expect,use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app.js';
import User from '../../models/User.js';
const chai = use(chaiHttp);

describe('User Management Functional Tests', () => {
    before(async () => {
        await User.destroy({ where: {}, truncate: true });
    });

    it('should create, update, and delete a user successfully', async () => {
        const user = { name: 'John Doe', email: 'john@example.com', password: '123456' };

        const createRes = await chai.request.execute(app).post('/users').send(user);
        expect(createRes).to.have.status(201);
        const userId = createRes.body.id;

        const updatedUser = { name: 'John Smith', email: 'john.smith@example.com', password: '654321' };
        const updateRes = await chai.request.execute(app).put(`/users/${userId}`).send(updatedUser);
        expect(updateRes).to.have.status(200);
        expect(updateRes.body).to.have.property('name').eql('John Smith');

        const deleteRes = await chai.request.execute(app).delete(`/users/${userId}`);
        expect(deleteRes).to.have.status(200);
        expect(deleteRes.body).to.have.property('message').eql('User deleted');

        const fetchRes = await chai.request.execute(app).get(`/users/${userId}`);
        expect(fetchRes).to.have.status(404);
        expect(fetchRes.body).to.have.property('error').eql('User not found');
    });
});
