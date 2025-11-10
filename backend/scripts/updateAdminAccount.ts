import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDatabase } from '../src/config/database';
import Admin from '../src/models/Admin';

dotenv.config();

/**
 * Script pour créer/mettre à jour le compte administrateur principal
 * Email: ayarirayen539@gmail.com
 * Mot de passe: admin123
 */
const updateAdminAccount = async () => {
  try {
    console.log('🔧 Mise à jour du compte administrateur...\n');

    // Connexion à MongoDB
    await connectDatabase();

    const adminEmail = 'ayarirayen539@gmail.com';
    const adminPassword = 'admin123';

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('👤 Compte admin existant trouvé, mise à jour du mot de passe...');
      
      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Mettre à jour le mot de passe
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'super-admin'; // S'assurer qu'il a le rôle super-admin
      await existingAdmin.save();
      
      console.log('✅ Mot de passe du compte admin mis à jour avec succès!');
    } else {
      console.log('🆕 Création d\'un nouveau compte administrateur...');
      
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Créer le nouvel admin
      const newAdmin = new Admin({
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrator',
        role: 'super-admin',
        isActive: true
      });
      
      await newAdmin.save();
      console.log('✅ Nouveau compte administrateur créé avec succès!');
    }

    console.log('\n📧 Email: ayarirayen539@gmail.com');
    console.log('🔑 Mot de passe: admin123');
    console.log('\n✨ Vous pouvez maintenant vous connecter avec ces identifiants!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du compte admin:', error);
    process.exit(1);
  }
};

// Exécuter le script
updateAdminAccount();
