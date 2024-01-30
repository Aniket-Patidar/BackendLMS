"use strict";
const nodemailer = require("nodemailer");

async function sendEmail(next, to, subject, text) {
    try {
        let testAccount = await nodemailer.createTestAccount();

        let transporter = await nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: 'xzavier.cole36@ethereal.email',
                pass: 'Qwu9kX6MNyRnhQKvYj'
            }
        });

        let info = await transporter.sendMail({
            from: process.env.ORIGINATION_EMAIL,
            to,
            subject,
            text,
        });
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        next(err);
    }
}

module.exports = sendEmail;
