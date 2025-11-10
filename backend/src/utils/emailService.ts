import nodemailer from 'nodemailer';

// Configuration du transporteur d'email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Générer un code à 6 chiffres
export const generateResetCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Envoyer un email de réinitialisation
export const sendResetPasswordEmail = async (
  email: string,
  code: string,
  name: string
): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Code de réinitialisation de mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
        <p>Bonjour ${name},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Votre code de réinitialisation est :</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #666;">Ce code est valide pendant 10 minutes.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">E-commerce Store - Votre boutique en ligne</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send reset email');
  }
};

// Envoyer email de confirmation de changement de mot de passe
export const sendPasswordChangedEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Mot de passe modifié',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Mot de passe modifié avec succès</h2>
        <p>Bonjour ${name},</p>
        <p>Votre mot de passe a été modifié avec succès.</p>
        <p>Si vous n'êtes pas à l'origine de ce changement, veuillez contacter immédiatement notre support.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">E-commerce Store - Votre boutique en ligne</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};
