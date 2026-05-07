import 'dotenv/config';
import sendEmail from './mailer.js';
import { verificationEmailHtml } from './emailTemplates.js';

await sendEmail({
    to: 'test@example.com',
    subject: 'Test Verification Email',
    html: verificationEmailHtml('http://localhost:5173/verify-email/testtoken123'),
});

console.log('Test email sent successfully');