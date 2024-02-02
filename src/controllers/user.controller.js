import UserService from '../services/user.services';
import bcrypt from 'bcrypt';

export default class UserController {
    static async create(data) {
        console.log('Creating a new user 🙋‍♂️');
        const newUser = await UserService.create(data);
        console.log('User created successfully 🙋‍♂️');
        return newUser;
    }

    static async get(query = {}) {
        const users = await UserService.findAll(query);
        return users;
    }

    static async getById(userId) {
        const user = await UserService.findById(userId);
        if (!user) {
            throw new Error(`User ID not found: ${userId} 😨`);
        }
        return user;
    }

    static async updateById(userId, data) {
        await UserController.getById(userId);
        console.log('Updating the user 🙋‍♂️');
        await UserService.updateById(userId, data);
        console.log('User updated successfully 🙋‍♂️');
    }

    static async deleteById(userId) {
        await UserController.getById(userId);
        console.log('Deleting the user 🙋‍♂️');
        await UserService.deleteById(userId);
        console.log('User deleted successfully 🙋‍♂️');
    }

    static async resetPassword(token, newPassword) {
        const user = await UserService.findByResetToken(token);
        if (!user || user.resetTokenExpiry < Date.now()) {
            throw new Error('Token is invalid or has expired');
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new Error('New password must be different from the old password');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await UserService.updateById(user._id, { 
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null 
        });
    }

    static async toggleUserRole(userId) {
        const user = await UserDAO.getById(userId);
        if (!user) {
            throw new Error(`User ID not found: ${userId}`);
        }
    
        const newRole = user.role === 'premium' ? 'user' : 'premium';
        await UserDAO.updateById(userId, { role: newRole });
    }
}
