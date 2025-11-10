const mongoose = require('mongoose');
require('dotenv').config();

// Admin Schema (même que dans simple-admin-server.js)
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
});

const Admin = mongoose.model('Admin', adminSchema);

async function checkAdminAccounts() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer tous les comptes admin
    const admins = await Admin.find({}).select('+password');
    
    console.log('👥 COMPTES ADMIN DANS LA BASE DE DONNÉES:');
    console.log('='.repeat(50));
    
    if (admins.length === 0) {
      console.log('❌ Aucun compte admin trouvé dans la base de données!');
    } else {
      admins.forEach((admin, index) => {
        console.log(`\n📋 Admin ${index + 1}:`);
        console.log(`   ID: ${admin._id}`);
        console.log(`   Nom: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Rôle: ${admin.role || 'NON DÉFINI'}`);
        console.log(`   Actif: ${admin.isActive ? '✅ Oui' : '❌ Non'}`);
        console.log(`   Mot de passe hashé: ${admin.password ? '✅ Présent' : '❌ Manquant'}`);
        console.log(`   Dernière connexion: ${admin.lastLogin || 'Jamais'}`);
      });
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📊 Total: ${admins.length} compte(s) admin`);

    // Vérification spécifique pour l'email du serveur
    const serverAdmin = await Admin.findOne({ email: 'ayarirayen539@gmail.com' });
    if (serverAdmin) {
      console.log('\n🔍 VÉRIFICATION EMAIL SERVEUR (ayarirayen539@gmail.com):');
      console.log(`   Trouvé: ✅`);
      console.log(`   Rôle: ${serverAdmin.role || 'NON DÉFINI'}`);
      console.log(`   Actif: ${serverAdmin.isActive ? '✅' : '❌'}`);
    } else {
      console.log('\n❌ Email serveur (ayarirayen539@gmail.com) non trouvé dans la DB');
    }

    // Vérification pour l'email du test
    const testAdmin = await Admin.findOne({ email: 'admin@example.com' });
    if (testAdmin) {
      console.log('\n🔍 VÉRIFICATION EMAIL TEST (admin@example.com):');
      console.log(`   Trouvé: ✅`);
      console.log(`   Rôle: ${testAdmin.role || 'NON DÉFINI'}`);
      console.log(`   Actif: ${testAdmin.isActive ? '✅' : '❌'}`);
    } else {
      console.log('\n❌ Email test (admin@example.com) non trouvé dans la DB');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
    process.exit(0);
  }
}

checkAdminAccounts();