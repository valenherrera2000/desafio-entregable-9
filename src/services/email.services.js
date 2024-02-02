import nodemailer from 'nodemailer';
import config from '../config/config.js';

export default class EmailService {
    static #instance = null;

    constructor() {
        // Create a nodemailer transport using the configuration settings
        this.transport = nodemailer.createTransport({
            service: config.mail.service,
            port: config.mail.port,
            auth: {
                user: config.mail.user,
                pass: config.mail.password,
            },
        });
    }

    // Send an email with the specified parameters
    sendEmail(to, subject, html, attachments = []) {
        return this.transport.sendMail({
            from: config.mail.user,
            to,
            subject,
            html,
            attachments,
        });
    }

    // Send a welcome email to a student
    sendWelcomeEmail(student) {
        return this.sendEmail(
            student.email,
            `Hello ${student.first_name} 😁`,
            `<h1>Hello ${student.first_name}, welcome to our school! 😍</h1>`
        );
    }

    // Send a password recovery email to a user
    sendPasswordRecoveryEmail(user, recoveryLink) {
        const subject = 'Password Recovery';
        const html = `
      <p>Hello ${user.first_name},</p>
      <p>We received a request to reset the password for your account. If you did not make this request, you can ignore this email.</p>
      <p>To reset your password, click on the following link:</p>
      <a href="${recoveryLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;
        return this.sendEmail(user.email, subject, html);
    }

    // Get a singleton instance of the EmailService
    static getInstance() {
        if (!EmailService.#instance) {
            EmailService.#instance = new EmailService();
        }
        return EmailService.#instance;
    }
}
