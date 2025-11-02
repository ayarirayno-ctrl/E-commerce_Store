import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, html, attachments = [] }) => {
  try {
    // Configuration du transporteur
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Options de l'email
    const mailOptions = {
      from: `"E-commerce Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html,
      attachments: attachments // Support pour les pièces jointes
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email envoyé:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};

export default sendEmail;
