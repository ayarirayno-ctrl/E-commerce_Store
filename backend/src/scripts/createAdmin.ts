import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin';
import { connectDatabase } from '../config/database';

// Charger les variables d'environnement
dotenv.config();

const createInitialAdmin = async () => {
  try {
    // Connexion à la base de données
    await connectDatabase();

    // Vérifier si un admin existe déjà
    const existingAdmin = await Admin.findOne({ role: 'super-admin' });

    if (existingAdmin) {
      console.log('Un super-admin existe déjà !');
      process.exit(0);
    }

    // Créer le premier admin
    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'Admin@123456',
      role: 'super-admin'
    });

    console.log('Super Admin créé avec succès !');
    console.log('Email:', admin.email);
    console.log('Mot de passe: Admin@123456');
    console.log('IMPORTANT: Changez le mot de passe après votre première connexion !');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création du super admin:', error);
    process.exit(1);
  }
};

createInitialAdmin();