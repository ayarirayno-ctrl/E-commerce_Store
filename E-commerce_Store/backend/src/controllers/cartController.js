import AbandonedCart from '../models/AbandonedCart.js';
import { sendAbandonedCartEmailsNow } from '../jobs/abandonedCartJob.js';

// @desc    Sauvegarder le panier abandonné
// @route   POST /api/cart/save
// @access  Private
export const saveAbandonedCart = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide' });
    }

    // Vérifier si un panier abandonné existe déjà pour cet utilisateur (non converti)
    let abandonedCart = await AbandonedCart.findOne({
      user: req.user._id,
      converted: false
    }).sort({ createdAt: -1 });

    if (abandonedCart) {
      // Mettre à jour le panier existant
      abandonedCart.cartItems = cartItems;
      abandonedCart.calculateTotal();
      abandonedCart.emailSent = false;
      abandonedCart.emailSentAt = null;
    } else {
      // Créer un nouveau panier abandonné
      abandonedCart = new AbandonedCart({
        user: req.user._id,
        cartItems
      });
      abandonedCart.calculateTotal();
    }

    await abandonedCart.save();

    res.status(200).json({
      success: true,
      message: 'Panier sauvegardé',
      cart: abandonedCart
    });

  } catch (error) {
    console.error('Erreur sauvegarde panier:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la sauvegarde du panier', 
      error: error.message 
    });
  }
};

// @desc    Marquer le panier comme converti (commande passée)
// @route   POST /api/cart/converted
// @access  Private
export const markCartAsConverted = async (req, res) => {
  try {
    const abandonedCart = await AbandonedCart.findOne({
      user: req.user._id,
      converted: false
    }).sort({ createdAt: -1 });

    if (abandonedCart) {
      abandonedCart.converted = true;
      abandonedCart.convertedAt = Date.now();
      await abandonedCart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Panier marqué comme converti'
    });

  } catch (error) {
    console.error('Erreur conversion panier:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la conversion du panier', 
      error: error.message 
    });
  }
};

// @desc    Obtenir tous les paniers abandonnés (Admin)
// @route   GET /api/cart/abandoned
// @access  Private/Admin
export const getAbandonedCarts = async (req, res) => {
  try {
    const abandonedCarts = await AbandonedCart.find({ converted: false })
      .populate('user', 'firstName lastName email')
      .populate('cartItems.product', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: abandonedCarts.length,
      carts: abandonedCarts
    });

  } catch (error) {
    console.error('Erreur récupération paniers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des paniers', 
      error: error.message 
    });
  }
};

// @desc    Envoyer manuellement les emails de paniers abandonnés (Test)
// @route   POST /api/cart/send-abandoned-emails
// @access  Private/Admin
export const sendAbandonedCartEmails = async (req, res) => {
  try {
    const result = await sendAbandonedCartEmailsNow();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Emails envoyés avec succès',
        totalCarts: result.totalCarts,
        successCount: result.successCount,
        errorCount: result.errorCount
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi des emails',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur envoi emails paniers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'envoi des emails', 
      error: error.message 
    });
  }
};
