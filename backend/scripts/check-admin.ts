import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Admin from '../src/models/Admin';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const checkAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Connecté à MongoDB\n');

    const admin = await Admin.findOne({ email: 'ayarirayen539@gmail.com' }).select('+password');
    
    if (admin) {
      console.log('📧 Admin trouvé:');
      console.log('ID:', admin._id);
      console.log('Email:', admin.email);
      console.log('Name:', admin.name);
      console.log('Role:', admin.role);
      console.log('Active:', admin.isActive);
      console.log('Password hash exists:', !!admin.password);
      
      // Test du mot de passe
      const isMatch = await admin.comparePassword('admin123');
      console.log('\n🔐 Test mot de passe "admin123":', isMatch ? '✅ Correct' : '❌ Incorrect');
    } else {
      console.log('❌ Aucun admin trouvé avec cet email');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkAdmin();
