import { sendLowStockAlertNow } from '../jobs/lowStockAlertJob.js';

// @desc    Envoyer manuellement l'alerte de stock bas (Test)
// @route   POST /api/admin/send-stock-alert
// @access  Private/Admin
export const sendStockAlert = async (req, res) => {
  try {
    const result = await sendLowStockAlertNow();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        count: result.count,
        products: result.products
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'alerte',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur envoi alerte stock:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'envoi de l\'alerte', 
      error: error.message 
    });
  }
};
