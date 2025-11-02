import cron from 'node-cron';
import AbandonedCart from '../models/AbandonedCart.js';
import sendEmail from '../utils/sendEmail.js';
import { abandonedCartEmailTemplate } from '../utils/emailTemplates.js';

/**
 * Tâche CRON pour envoyer des emails de rappel pour les paniers abandonnés
 * S'exécute tous les jours à 10h00
 */
export const abandonedCartEmailJob = () => {
  // Planifier l'exécution tous les jours à 10h00
  // Format: seconde minute heure jour mois jour_de_la_semaine
  cron.schedule('0 10 * * *', async () => {
    console.log('🕐 Tâche CRON: Vérification des paniers abandonnés...');
    
    try {
      // Trouver les paniers abandonnés depuis plus de 24h qui n'ont pas encore reçu d'email
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const abandonedCarts = await AbandonedCart.find({
        emailSent: false,
        converted: false,
        createdAt: { $lte: twentyFourHoursAgo }
      }).populate('user').populate('cartItems.product');

      console.log(`📊 ${abandonedCarts.length} panier(s) abandonné(s) trouvé(s)`);

      // Envoyer un email pour chaque panier abandonné
      for (const cart of abandonedCarts) {
        try {
          const user = cart.user;
          
          // Envoyer l'email
          await sendEmail({
            email: user.email,
            subject: '🛒 Vous avez oublié des articles dans votre panier !',
            html: abandonedCartEmailTemplate(cart, user)
          });

          // Marquer l'email comme envoyé
          cart.emailSent = true;
          cart.emailSentAt = Date.now();
          await cart.save();

          console.log(`✅ Email envoyé à ${user.email} pour le panier ${cart._id}`);
        } catch (emailError) {
          console.error(`❌ Erreur envoi email pour le panier ${cart._id}:`, emailError);
        }
      }

      console.log('✅ Tâche CRON terminée avec succès');
    } catch (error) {
      console.error('❌ Erreur dans la tâche CRON des paniers abandonnés:', error);
    }
  });

  console.log('✅ Tâche CRON des paniers abandonnés initialisée (tous les jours à 10h00)');
};

/**
 * Fonction manuelle pour tester l'envoi d'emails pour paniers abandonnés
 * Peut être appelée via une route admin pour tester sans attendre 24h
 */
export const sendAbandonedCartEmailsNow = async () => {
  console.log('🔧 Envoi manuel des emails de paniers abandonnés...');
  
  try {
    // Pour le test, on prend les paniers abandonnés depuis plus de 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const abandonedCarts = await AbandonedCart.find({
      emailSent: false,
      converted: false,
      createdAt: { $lte: fiveMinutesAgo }
    }).populate('user').populate('cartItems.product');

    console.log(`📊 ${abandonedCarts.length} panier(s) abandonné(s) trouvé(s)`);

    let successCount = 0;
    let errorCount = 0;

    for (const cart of abandonedCarts) {
      try {
        const user = cart.user;
        
        await sendEmail({
          email: user.email,
          subject: '🛒 Vous avez oublié des articles dans votre panier !',
          html: abandonedCartEmailTemplate(cart, user)
        });

        cart.emailSent = true;
        cart.emailSentAt = Date.now();
        await cart.save();

        successCount++;
        console.log(`✅ Email envoyé à ${user.email}`);
      } catch (emailError) {
        errorCount++;
        console.error(`❌ Erreur envoi email:`, emailError);
      }
    }

    return {
      success: true,
      totalCarts: abandonedCarts.length,
      successCount,
      errorCount
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi manuel:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default abandonedCartEmailJob;
