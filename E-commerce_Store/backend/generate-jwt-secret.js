#!/usr/bin/env node

/**
 * Générateur de JWT Secret sécurisé pour la production
 * Usage: node generate-jwt-secret.js
 */

import crypto from 'crypto';

// Générer un secret fort de 64 caractères
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('\n🔐 JWT SECRET GÉNÉRÉ AVEC SUCCÈS\n');
console.log('━'.repeat(80));
console.log('\nCopiez cette valeur dans vos variables d\'environnement:');
console.log('\n' + '─'.repeat(80));
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('─'.repeat(80));
console.log('\n⚠️  IMPORTANT:');
console.log('  • NE PARTAGEZ JAMAIS cette valeur');
console.log('  • Utilisez la MÊME valeur pour Railway (production)');
console.log('  • Gardez une copie sécurisée (gestionnaire de mots de passe)');
console.log('  • Changez-la uniquement si elle est compromise\n');
console.log('━'.repeat(80) + '\n');
