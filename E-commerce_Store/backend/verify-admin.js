import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const verifyAdmin = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connecté à MongoDB');

    // Trouver l'utilisateur admin
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('❌ Aucun compte admin trouvé dans la base de données');
      console.log('\nCréez un compte admin via /register avec le role admin');
      process.exit(1);
    }

    console.log('\n📋 Détails du compte admin:');
    console.log('Email:', admin.email);
    console.log('Nom:', admin.firstName, admin.lastName);
    console.log('Email vérifié:', admin.isEmailVerified);
    console.log('Bloqué:', admin.isBlocked);
    console.log('Role:', admin.role);

    // Verifier et activer le compte si necessaire
    if (!admin.isEmailVerified || admin.isBlocked) {
      console.log('\nLe compte a des problemes. Correction en cours...');
      
      admin.isEmailVerified = true;
      admin.isBlocked = false;
      await admin.save();
      
      console.log('Compte admin active avec succes!');
      console.log('\nVous pouvez maintenant vous connecter avec:');
      console.log('Email:', admin.email);
    } else {
      console.log('\nLe compte admin est deja actif et pret');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

verifyAdmin();
