const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Schema simplifiés pour le test
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true }
});

adminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

async function testAdminLogin() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    console.log('\n🔍 Recherche de l\'admin avec email: ayarirayen539@gmail.com');
    const admin = await Admin.findOne({ email: 'ayarirayen539@gmail.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin non trouvé');
      return;
    }
    
    console.log('✅ Admin trouvé:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      hasPassword: !!admin.password
    });

    console.log('\n🔑 Test du mot de passe: admin123');
    const isMatch = await admin.comparePassword('admin123');
    console.log('✅ Résultat de la comparaison:', isMatch);

    if (isMatch) {
      console.log('\n🎉 AUTHENTIFICATION RÉUSSIE !');
      console.log('Le problème n\'est pas dans la logique d\'authentification.');
    } else {
      console.log('\n❌ ÉCHEC D\'AUTHENTIFICATION');
      console.log('Le mot de passe ne correspond pas.');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

testAdminLogin();