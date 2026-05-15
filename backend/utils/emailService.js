import nodemailer from 'nodemailer';

export const sendStatusUpdateEmail = async (toEmail, jobTitle, status) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('----------------------------------------------------');
            console.log('[Email Skipped] SMTP credentials are not configured in .env');
            console.log(`[Email Details] To: ${toEmail} | Subject: Update for ${jobTitle} | Status: ${status}`);
            console.log('----------------------------------------------------');
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to another service line 'smtp.gmail.com' or custom host
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"JobPortal" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `Update on your application for ${jobTitle}`,
            text: `Hello, your application status for the ${jobTitle} position has been updated to: ${status}. 

Thank you for your interest!
- JobPortal Team`,
        });

        console.log(`Email successfully sent to ${toEmail}. Message ID: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
