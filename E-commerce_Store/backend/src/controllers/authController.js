import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { verificationEmailTemplate, welcomeEmailTemplate, resetPasswordEmailTemplate } from '../utils/emailTemplates.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone
    });

    // Générer le token de vérification
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // URL de vérification
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // Envoyer l'email de vérification
    await sendEmail({
      email: user.email,
      subject: 'Vérification de votre compte E-commerce Store',
      html: verificationEmailTemplate(user.firstName, verificationUrl)
    });

    res.status(201).json({
      message: 'Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.',
      userId: user._id
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    
    // Gestion spécifique des erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Erreur de validation',
        error: error.message 
      });
    }
    
    // Gestion des erreurs de duplication (email déjà utilisé)
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Cet email est déjà utilisé' 
      });
    }
    
    // Autres erreurs serveur
    res.status(500).json({ 
      message: 'Erreur lors de l\'inscription',
      error: error.message 
    });
  }
};

// @desc    Vérification de l'email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hasher le token reçu
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Trouver l'utilisateur avec ce token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Token de vérification invalide ou expiré' 
      });
    }

    // Activer le compte
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    // Envoyer l'email de bienvenue
    await sendEmail({
      email: user.email,
      subject: 'Bienvenue chez E-commerce Store !',
      html: welcomeEmailTemplate(user.firstName)
    });

    // Générer le token JWT
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      message: 'Email vérifié avec succès !',
      token: jwtToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Erreur vérification email:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la vérification',
      error: error.message 
    });
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si l'email est vérifié
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: 'Veuillez vérifier votre email avant de vous connecter. Consultez votre boîte mail.'
      });
    }

    // Vérifier si l'utilisateur est bloqué
    if (user.isBlocked) {
      return res.status(403).json({ 
        message: 'You are blocked from admin device. Please contact support.'
      });
    }

    // Mettre à jour la date de dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Générer le token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la connexion',
      error: error.message 
    });
  }
};

// @desc    Demande de réinitialisation de mot de passe
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });

    if (!user) {
      // Pour la sécurité, on renvoie le même message
      return res.status(200).json({ 
        message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.' 
      });
    }

    // Générer le token de réinitialisation
    const resetToken = user.generateResetPasswordToken();
    await user.save();

    // URL de réinitialisation
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Envoyer l'email
    await sendEmail({
      email: user.email,
      subject: 'Réinitialisation de votre mot de passe - E-commerce Store',
      html: resetPasswordEmailTemplate(user.firstName, resetUrl)
    });

    res.status(200).json({
      message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.',
      // En développement uniquement pour debug
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl })
    });

  } catch (error) {
    console.error('Erreur forgot password:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'envoi de l\'email',
      error: error.message 
    });
  }
};

// @desc    Réinitialisation du mot de passe
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validation
    if (!password) {
      return res.status(400).json({ message: 'Mot de passe requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Le mot de passe doit contenir au moins 6 caractères' 
      });
    }

    // Hasher le token reçu
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Trouver l'utilisateur avec ce token et vérifier expiration
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Token de réinitialisation invalide ou expiré' 
      });
    }

    // Mettre à jour le mot de passe
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Générer nouveau token JWT
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      message: 'Mot de passe réinitialisé avec succès !',
      token: jwtToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Erreur reset password:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la réinitialisation',
      error: error.message 
    });
  }
};

