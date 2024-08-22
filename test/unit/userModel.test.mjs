import { expect } from 'chai';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';

describe('User Model Unit Tests', () => {
    it('should create a user instance with valid attributes', () => {
        const user = User.build({ name: 'John Doe', email: 'john@example.com', password: '123456' });
        expect(user).to.have.property('name').eql('John Doe');
        expect(user).to.have.property('email').eql('john@example.com');
        expect(user).to.have.property('password').eql('123456');
    });

    it('should fail if email is not unique', async () => {
        await User.create({ name: 'John Doe', email: 'john@example.com', password: '123456' });
        try {
            await User.create({ name: 'Jane Doe', email: 'john@example.com', password: 'abcdef' });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.name).to.equal('SequelizeUniqueConstraintError');
        }
    });

    it('should hash the password before saving', async () => {
        const user = await User.create({ name: 'John Doe', email: 'john2@example.com', password: '123456' });
        expect(user.password).to.not.equal('123456');
        const isMatch = await bcrypt.compare('123456', user.password);
        expect(isMatch).to.be.true;
    });
});
