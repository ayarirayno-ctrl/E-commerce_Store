import Order from '../models/Order.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { 
  orderShippedEmailTemplate, 
  orderDeliveredEmailTemplate, 
  orderCancelledEmailTemplate,
  invoiceEmailTemplate,
  newOrderAdminEmailTemplate
} from '../utils/emailTemplates.js';
import generateInvoicePDF from '../utils/generateInvoicePDF.js';
import fs from 'fs';

// Template email de confirmation de commande
const orderConfirmationTemplate = (order, user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white; 
          padding: 40px 20px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content { 
          padding: 40px 30px; 
        }
        .order-number {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 15px;
          margin: 20px 0;
          font-size: 18px;
          font-weight: bold;
        }
        .order-item { 
          border-bottom: 1px solid #e5e7eb; 
          padding: 15px 0;
          display: flex;
          justify-content: space-between;
        }
        .order-item:last-child {
          border-bottom: none;
        }
        .total { 
          font-size: 20px; 
          font-weight: bold; 
          color: #10b981; 
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: right;
        }
        .address-box {
          background: #f9fafb;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          background: #f9fafb;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Commande Confirmée !</h1>
        </div>
        <div class="content">
          <h2>Merci ${user.firstName} !</h2>
          <p>Votre commande a été confirmée avec succès. Nous préparons vos articles avec soin.</p>
          
          <div class="order-number">
            📦 Numéro de commande : <span style="color: #10b981;">${order.orderNumber}</span>
          </div>
          
          <h3>Détails de la commande :</h3>
          <div>
            ${order.items.map(item => `
              <div class="order-item">
                <div>
                  <strong>${item.name}</strong><br>
                  <span style="color: #6b7280; font-size: 14px;">Quantité: ${item.quantity}</span>
                </div>
                <div style="text-align: right;">
                  <strong>${(item.price * item.quantity).toFixed(2)}€</strong><br>
                  <span style="color: #6b7280; font-size: 14px;">${item.price.toFixed(2)}€ / unité</span>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 5px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Sous-total:</span>
              <span>${order.itemsPrice.toFixed(2)}€</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Livraison:</span>
              <span>${order.shippingPrice.toFixed(2)}€</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>TVA:</span>
              <span>${order.taxPrice.toFixed(2)}€</span>
            </div>
          </div>
          
          <p class="total">Total: ${order.totalPrice.toFixed(2)}€</p>
          
          <h3>Adresse de livraison :</h3>
          <div class="address-box">
            <strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong><br>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.postalCode} ${order.shippingAddress.city}<br>
            ${order.shippingAddress.country}<br>
            📞 ${order.shippingAddress.phone}
          </div>
          
          <h3>Méthode de paiement :</h3>
          <p>${order.paymentMethod === 'card' ? '💳 Carte bancaire' : 
             order.paymentMethod === 'paypal' ? '🅿️ PayPal' : 
             '💵 Paiement à la livraison'}</p>
          
          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <strong>📬 Prochaine étape :</strong><br>
            Vous recevrez un email avec le numéro de suivi une fois votre commande expédiée.
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">
            Des questions ? Contactez-nous :<br>
            📧 ayarirayen539@gmail.com<br>
            📞 +216 94 816 735
          </p>
        </div>
        <div class="footer">
          <p>© 2025 E-commerce Store - Nabeul, Tunisia</p>
          <p>Merci pour votre confiance !</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// @desc    Créer une nouvelle commande
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      promoCode
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Aucun article dans la commande' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      promoCode
    });

    // Récupérer l'utilisateur pour l'email
    const user = await User.findById(req.user._id);

    // Envoyer email de confirmation au client
    await sendEmail({
      email: user.email,
      subject: `Confirmation de commande ${order.orderNumber}`,
      html: orderConfirmationTemplate(order, user)
    });

    // Envoyer notification email à l'admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'ayarirayen539@gmail.com';
      await sendEmail({
        email: adminEmail,
        subject: `🔔 Nouvelle commande ${order.orderNumber}`,
        html: newOrderAdminEmailTemplate(order, user)
      });
      console.log('📧 Email admin envoyé pour nouvelle commande:', order.orderNumber);
    } catch (adminEmailError) {
      console.error('⚠️ Erreur envoi email admin:', adminEmailError);
      // Ne pas bloquer la création de commande si l'email admin échoue
    }

    res.status(201).json({
      message: 'Commande créée avec succès',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Obtenir l'historique des commandes de l'utilisateur
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Obtenir une commande par ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Mettre à jour le statut de la commande
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, cancellationReason } = req.body;

    const order = await Order.findById(req.params.id).populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const oldStatus = order.status;
    order.status = status || order.status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    // Envoyer l'email approprié selon le nouveau statut
    try {
      const user = order.user;
      
      if (status === 'shipped' && oldStatus !== 'shipped') {
        await sendEmail({
          email: user.email,
          subject: `📦 Votre commande ${order.orderNumber} a été expédiée`,
          html: orderShippedEmailTemplate(order, user)
        });
      } else if (status === 'delivered' && oldStatus !== 'delivered') {
        await sendEmail({
          email: user.email,
          subject: `🎉 Votre commande ${order.orderNumber} a été livrée`,
          html: orderDeliveredEmailTemplate(order, user)
        });
      } else if (status === 'cancelled' && oldStatus !== 'cancelled') {
        await sendEmail({
          email: user.email,
          subject: `❌ Votre commande ${order.orderNumber} a été annulée`,
          html: orderCancelledEmailTemplate(order, user, cancellationReason)
        });
      }
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // Ne pas bloquer la mise à jour du statut si l'email échoue
    }

    res.status(200).json({
      message: 'Statut mis à jour',
      order
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Obtenir toutes les commandes (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Envoyer la facture par email
// @route   POST /api/orders/:id/send-invoice
// @access  Private/Admin
export const sendInvoiceEmail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const user = order.user;

    // Générer le PDF de la facture
    const pdfPath = await generateInvoicePDF(order, user);

    // Envoyer l'email avec la facture en pièce jointe
    await sendEmail({
      email: user.email,
      subject: `📄 Facture ${order.orderNumber} - E-commerce Store`,
      html: invoiceEmailTemplate(order, user),
      attachments: [
        {
          filename: `facture-${order.orderNumber}.pdf`,
          path: pdfPath
        }
      ]
    });

    // Supprimer le fichier PDF après l'envoi
    fs.unlinkSync(pdfPath);

    res.status(200).json({
      success: true,
      message: 'Facture envoyée par email avec succès'
    });

  } catch (error) {
    console.error('Erreur envoi facture:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'envoi de la facture', 
      error: error.message 
    });
  }
};
