import UserRepository from '../repositories/user.repository';
import crypto from 'crypto';
import EmailService from './email.services';

export default class UserService {
    static findAll(filter = {}) {
        return UserRepository.getAll(filter);
    }

    static async create(payload) {
        console.log('Creating a new user 🙋‍♂️');
        const user = await UserRepository.create(payload);
        console.log(`User created successfully (${user._id}) 🙋‍♂️`);
        return user;
    }

    static findById(uid) {
        return UserRepository.getById(uid);
    }

    static updateById(uid, payload) {
        return UserRepository.updateById(uid, payload);
    }

    static deleteById(uid) {
        return UserRepository.deleteById(uid);
    }

    static async requestPasswordRecovery(email) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        const resetTokenExpiry = Date.now() + 3600000; // 1 hour in milliseconds

        await UserRepository.updateById(user._id, { resetToken, resetTokenExpiry });

        const resetLink = `http://yourdomain.com/reset-password?token=${resetToken}`;
        await EmailService.sendPasswordRecoveryEmail(user, resetLink);
    }
}
