import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

function decrypt(text: string): string {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const encryptionIv = process.env.ENCRYPTION_IV;

    if (!encryptionKey || !encryptionIv) {
        throw new Error("Encryption key and IV must be set in environment variables");
    }

    const key = Buffer.from(encryptionKey, 'hex'); // 'hex'
    const iv = Buffer.from(encryptionIv, 'hex');

    // Base64 decode the text first
    // const encryptedText = Buffer.from(text, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
function decrypt_GPT(text: string): string {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const encryptionIv = process.env.ENCRYPTION_IV;

    if (!encryptionKey || !encryptionIv) {
        throw new Error("Encryption key and IV must be set in environment variables");
    }

    const key = Buffer.from(encryptionKey, 'hex');
    const iv = Buffer.from(encryptionIv, 'hex');

    // Base64 decode the text first, assuming the encrypted text was encoded with base64
    const encryptedText = Buffer.from(text, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);  // Buffer.concat is nodig om buffers correct te combineren

    return decrypted.toString('utf8');  // Zet de buffer om naar een string
}


const emailConfigurations = {
    yahoo: {
        host: process.env.YAHOO_EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.YAHOO_USER,
            pass: decrypt(process.env.ENCRYPTED_YAHOO_PASS!)
        }
    },
    gmail: {
        host: process.env.GMAIL_EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: decrypt(process.env.ENCRYPTED_GMAIL_PASS || '')
        }
    },
    outlook: {
        host: process.env.OUTLOOK_EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.OUTLOOK_USER,
            pass: decrypt(process.env.ENCRYPTED_OUTLOOK_PASS!)
        }
    }
};

const createTransporter = (provider: 'yahoo' | 'gmail' | 'outlook') => {
    return nodemailer.createTransport(emailConfigurations[provider]);
};

export const sendEmail = async (provider: 'yahoo' | 'gmail' | 'outlook', to: string, subject: string, text: string) => {
    const transporter = createTransporter(provider);

    try {
        if (!to) {
            throw new Error("Recipient email address is missing");
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text
        });
        console.log('Email sent:', info.response);
        return info;
    } catch (error: any) {
        console.error('Error sending email:', error);
        throw error;
    }
};


/**
 * Version 2
 */
// import nodemailer from 'nodemailer';
// import crypto from 'crypto';
// import dotenv from 'dotenv';
//
// dotenv.config();
//
// function decrypt(text: string): string {
//     const encryptionKey = process.env.ENCRYPTION_KEY;
//     const encryptionIv = process.env.ENCRYPTION_IV;
//
//     if (!encryptionKey || !encryptionIv) {
//         throw new Error("Encryption key and IV must be set in environment variables");
//     }
//
//     const key = Buffer.from(encryptionKey, 'hex');
//     const iv = Buffer.from(encryptionIv, 'hex');
//
//     const encryptedText = Buffer.from(text, 'base64'); // Base64 decode the text first
//
//     const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
//     let decrypted = decipher.update(text, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }
//
// const emailConfigurations = {
//     yahoo: {
//         host: process.env.YAHOO_EMAIL_HOST || 'smtp.mail.yahoo.com',
//         port: 587,
//         auth: {
//             user: process.env.YAHOO_USER,
//             pass: decrypt(process.env.ENCRYPTED_YAHOO_PASS!)
//         }
//     },
//     gmail: {
//         host: process.env.GMAIL_EMAIL_HOST || 'smtp.gmail.com',
//         port: 587,
//         auth: {
//             user: process.env.GMAIL_USER,
//             pass: decrypt(process.env.ENCRYPTED_GMAIL_PASS!)
//         }
//     },
//     outlook: {
//         host: process.env.OUTLOOK_EMAIL_HOST || 'smtp.office365.com',
//         port: 587,
//         auth: {
//             user: process.env.OUTLOOK_USER,
//             pass: decrypt(process.env.ENCRYPTED_OUTLOOK_PASS!)
//         }
//     }
// };
//
// const createTransporter = (provider: 'yahoo' | 'gmail' | 'outlook') => {
//     return nodemailer.createTransport(emailConfigurations[provider]);
// };
//
// export const sendEmail = async (provider: 'yahoo' | 'gmail' | 'outlook', to: string, subject: string, text: string) => {
//     const transporter = createTransporter(provider);
//     await transporter.sendMail({
//         from: process.env.EMAIL_FROM,
//         to,
//         subject,
//         text
//     });
// };
