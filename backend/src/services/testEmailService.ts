import { sendEmail } from './emailService';

sendEmail('gmail', 'dev.arammousa@gmail.com', 'Test Email', 'This is a test email')
    .then(() => console.log('Email sent successfully'))
    .catch(error => console.error('Error sending email:', error));
