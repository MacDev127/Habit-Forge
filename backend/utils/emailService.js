const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or other service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendResetEmail = async (email, token) => {
  try {
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // ✅ Define mailOptions before calling sendMail
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        <p>If you didn't request this, ignore this email.</p>
      `,
    };

    // ✅ Pass mailOptions to sendMail
    const info = await transporter.sendMail(mailOptions);
    console.log('Nodemailer success:', info);
  } catch (err) {
    console.error('Nodemailer error:', err);
    throw err; // Rethrow so your controller catches it
  }
};
