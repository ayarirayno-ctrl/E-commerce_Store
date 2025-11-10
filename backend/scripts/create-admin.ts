import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Admin from '../src/models/Admin';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Admin.findOne({ email: 'ayarirayen539@gmail.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin existe déjà, mise à jour du mot de passe...');
      existingAdmin.password = 'admin123';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('✅ Mot de passe admin mis à jour avec succès');
    } else {
      // Créer le nouvel admin
      const admin = await Admin.create({
        email: 'ayarirayen539@gmail.com',
        password: 'admin123',
        name: 'Administrateur',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Admin créé avec succès');
      console.log('Email:', admin.email);
    }

    console.log('\n📧 Email: ayarirayen539@gmail.com');
    console.log('🔑 Mot de passe: admin123');
    
    await mongoose.disconnect();
    console.log('\n✅ Déconnexion de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createAdmin();
