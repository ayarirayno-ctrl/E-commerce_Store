// Script pour créer le compte admin unique
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

// Schema User simplifié pour ce script
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isEmailVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

async function createAdminAccount() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'ayarirayen539@gmail.com', role: 'admin' });
    
    if (existingAdmin) {
      console.log('ℹ️  Le compte admin existe déjà');
      
      // Mise à jour du mot de passe
      const hashedPassword = await bcrypt.hash('admin123', 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.isEmailVerified = true;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      
      console.log('✅ Mot de passe admin mis à jour');
      console.log('📧 Email: ayarirayen539@gmail.com');
      console.log('🔑 Mot de passe: admin123');
    } else {
      // Créer le compte admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = new User({
        firstName: 'Admin',
        lastName: 'E-commerce',
        email: 'ayarirayen539@gmail.com',
        password: hashedPassword,
        phone: '+216 94 816 735',
        role: 'admin',
        isEmailVerified: true
      });

      await admin.save();
      console.log('✅ Compte admin créé avec succès !');
      console.log('📧 Email: ayarirayen539@gmail.com');
      console.log('🔑 Mot de passe: admin123');
    }

    // Afficher les statistiques
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalClients = await User.countDocuments({ role: 'user' });

    console.log('\n📊 Statistiques:');
    console.log(`   Total utilisateurs: ${totalUsers}`);
    console.log(`   Admins: ${totalAdmins}`);
    console.log(`   Clients: ${totalClients}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

createAdminAccount();
