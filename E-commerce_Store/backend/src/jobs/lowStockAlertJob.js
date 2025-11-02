import cron from 'node-cron';
import sendEmail from '../utils/sendEmail.js';
import { lowStockAdminEmailTemplate } from '../utils/emailTemplates.js';

/**
 * Tâche CRON pour vérifier le stock et alerter l'admin
 * S'exécute tous les jours à 8h00
 */
export const lowStockAlertJob = () => {
  // Planifier l'exécution tous les jours à 8h00
  cron.schedule('0 8 * * *', async () => {
    console.log('🕐 Tâche CRON: Vérification du stock...');
    
    try {
      // Importer Product ici pour éviter les problèmes de dépendances circulaires
      const { default: Product } = await import('../models/Product.js');
      
      // Définir le seuil de stock bas (configurable)
      const lowStockThreshold = parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;
      
      // Trouver les produits avec stock bas ou en rupture
      const lowStockProducts = await Product.find({
        stock: { $lte: lowStockThreshold }
      }).select('name category stock image price');

      if (lowStockProducts.length > 0) {
        console.log(`📊 ${lowStockProducts.length} produit(s) avec stock bas détecté(s)`);

        // Envoyer l'email d'alerte à l'admin
        const adminEmail = process.env.ADMIN_EMAIL || 'ayarirayen539@gmail.com';
        
        await sendEmail({
          email: adminEmail,
          subject: `⚠️ Alerte Stock Bas - ${lowStockProducts.length} produit${lowStockProducts.length > 1 ? 's' : ''}`,
          html: lowStockAdminEmailTemplate(lowStockProducts)
        });

        console.log(`✅ Email d'alerte stock envoyé à ${adminEmail}`);
      } else {
        console.log('✅ Tous les produits ont un stock suffisant');
      }

      console.log('✅ Tâche CRON de vérification stock terminée');
    } catch (error) {
      console.error('❌ Erreur dans la tâche CRON de vérification stock:', error);
    }
  });

  console.log('✅ Tâche CRON de vérification stock initialisée (tous les jours à 8h00)');
};

/**
 * Fonction manuelle pour tester l'alerte de stock bas
 * Peut être appelée via une route admin
 */
export const sendLowStockAlertNow = async () => {
  console.log('🔧 Envoi manuel de l\'alerte stock bas...');
  
  try {
    const { default: Product } = await import('../models/Product.js');
    const lowStockThreshold = parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;
    
    const lowStockProducts = await Product.find({
      stock: { $lte: lowStockThreshold }
    }).select('name category stock image price');

    if (lowStockProducts.length === 0) {
      return {
        success: true,
        message: 'Aucun produit avec stock bas',
        count: 0
      };
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'ayarirayen539@gmail.com';
    
    await sendEmail({
      email: adminEmail,
      subject: `⚠️ Alerte Stock Bas - ${lowStockProducts.length} produit${lowStockProducts.length > 1 ? 's' : ''}`,
      html: lowStockAdminEmailTemplate(lowStockProducts)
    });

    return {
      success: true,
      message: 'Email d\'alerte envoyé avec succès',
      count: lowStockProducts.length,
      products: lowStockProducts
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi manuel de l\'alerte:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default lowStockAlertJob;
