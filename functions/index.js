const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.api_key);

exports.sendVerificationEmail = functions.https.onCall(async (data, context) => {
    const { email, code } = data;
    const msg = {
        to: email,
        from: 'your-email@example.com', // Use your verified SendGrid sender email
        subject: 'Email Verification Code',
        text: `Your verification code is: ${code}`,
        html: `<strong>Your verification code is: ${code}</strong>`,
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
});
