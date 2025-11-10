const mongoose = require('mongoose');
require('dotenv').config();

// Schema utilisateur
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  role: { type: String, default: 'client' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  profile: {
    phone: String,
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    }
  }
});

const User = mongoose.model('User', userSchema);

// Exemples d'utilisateurs
const sampleUsers = [
  {
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    password: '$2a$10$example1', // Hash fictif
    isEmailVerified: true,
    lastLogin: new Date('2024-11-08'),
    profile: {
      phone: '01 23 45 67 89',
      address: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      }
    }
  },
  {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    password: '$2a$10$example2',
    isEmailVerified: true,
    lastLogin: new Date('2024-11-09'),
    profile: {
      phone: '01 98 76 54 32',
      address: {
        street: '456 Avenue des Champs',
        city: 'Lyon',
        postalCode: '69001',
        country: 'France'
      }
    }
  },
  {
    name: 'Marie Leblanc',
    email: 'marie.leblanc@example.com',
    password: '$2a$10$example3',
    isEmailVerified: false,
    lastLogin: new Date('2024-11-07'),
    profile: {
      phone: '01 11 22 33 44',
      address: {
        street: '789 Boulevard Victor Hugo',
        city: 'Marseille',
        postalCode: '13001',
        country: 'France'
      }
    }
  },
  {
    name: 'Pierre Moreau',
    email: 'pierre.moreau@example.com',
    password: '$2a$10$example4',
    isEmailVerified: true,
    lastLogin: new Date('2024-11-06'),
    profile: {
      phone: '01 55 66 77 88',
      address: {
        street: '321 Rue de la République',
        city: 'Toulouse',
        postalCode: '31000',
        country: 'France'
      }
    }
  },
  {
    name: 'Claire Dubois',
    email: 'claire.dubois@example.com',
    password: '$2a$10$example5',
    isEmailVerified: true,
    lastLogin: new Date('2024-11-05'),
    profile: {
      phone: '01 99 88 77 66',
      address: {
        street: '654 Place de la Liberté',
        city: 'Nice',
        postalCode: '06000',
        country: 'France'
      }
    }
  }
];

async function addSampleUsers() {
  try {
    console.log('👥 SCRIPT D\'AJOUT D\'UTILISATEURS D\'EXEMPLE');
    console.log('==========================================');
    console.log('Ce script va ajouter 5 utilisateurs d\'exemple dans votre base de données.');
    
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Vérifier les utilisateurs existants
    const existingUsers = await User.countDocuments();
    console.log(`📊 Utilisateurs actuels dans la base : ${existingUsers}`);
    
    if (existingUsers > 0) {
      console.log('⚠️  Des utilisateurs existent déjà. Ajout des nouveaux utilisateurs...\n');
    }

    console.log('👥 Ajout des utilisateurs d\'exemple...');
    console.log(`🛒 Ajout de ${sampleUsers.length} utilisateurs...\n`);
    
    for (let i = 0; i < sampleUsers.length; i++) {
      const userData = sampleUsers[i];
      
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          console.log(`⚠️  ${i + 1}/${sampleUsers.length} - ${userData.name} existe déjà`);
          continue;
        }
        
        const user = new User(userData);
        await user.save();
        console.log(`✅ ${i + 1}/${sampleUsers.length} - ${userData.name} ajouté(e) (${userData.email})`);
      } catch (error) {
        console.log(`❌ ${i + 1}/${sampleUsers.length} - Erreur pour ${userData.name}: ${error.message}`);
      }
    }

    // Statistiques finales
    const totalUsers = await User.countDocuments();
    console.log('\n🎉 Utilisateurs d\'exemple ajoutés avec succès !');
    console.log(`📊 Total d'utilisateurs : ${totalUsers}`);
    
    console.log('\n🌟 Utilisateurs ajoutés :');
    const addedUsers = await User.find({}).select('name email isEmailVerified profile.address.city');
    addedUsers.forEach(user => {
      const status = user.isEmailVerified ? '✅ Vérifié' : '⏳ À vérifier';
      console.log(`   • ${user.name} - ${user.email} (${user.profile?.address?.city || 'N/A'}) ${status}`);
    });

    console.log('\n🚀 Vous pouvez maintenant :');
    console.log('   1. Voir les utilisateurs via l\'admin : http://localhost:3002/admin');
    console.log('   2. Gérer les comptes utilisateurs');
    console.log('   3. Tester les connexions clients');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    console.log('\n🔐 Fermeture de la connexion MongoDB...');
    await mongoose.disconnect();
    process.exit(0);
  }
}

addSampleUsers();