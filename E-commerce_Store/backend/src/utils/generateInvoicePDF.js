import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Génère une facture PDF pour une commande
 * @param {Object} order - La commande avec tous les détails
 * @param {Object} user - L'utilisateur qui a passé la commande
 * @returns {Promise<string>} - Le chemin du fichier PDF généré
 */
export const generateInvoicePDF = async (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      // Créer le dossier invoices s'il n'existe pas
      const invoicesDir = path.join(process.cwd(), 'invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      // Nom du fichier PDF
      const fileName = `facture-${order.orderNumber}.pdf`;
      const filePath = path.join(invoicesDir, fileName);

      // Créer le document PDF
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // ==================== EN-TÊTE ====================
      doc
        .fontSize(20)
        .fillColor('#667eea')
        .text('E-COMMERCE STORE', 50, 50, { align: 'left' })
        .fontSize(10)
        .fillColor('#666')
        .text('Nabeul, Tunisia', 50, 75)
        .text('Email: ayarirayen539@gmail.com', 50, 90)
        .text('Tél: +216 94 816 735', 50, 105);

      // FACTURE (en haut à droite)
      doc
        .fontSize(25)
        .fillColor('#333')
        .text('FACTURE', 400, 50, { align: 'right' })
        .fontSize(10)
        .fillColor('#666')
        .text(`N° ${order.orderNumber}`, 400, 80, { align: 'right' })
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, 400, 95, { align: 'right' });

      // Ligne de séparation
      doc
        .strokeColor('#667eea')
        .lineWidth(2)
        .moveTo(50, 130)
        .lineTo(550, 130)
        .stroke();

      // ==================== INFORMATIONS CLIENT ====================
      doc
        .fontSize(12)
        .fillColor('#333')
        .text('FACTURÉ À:', 50, 150)
        .fontSize(10)
        .fillColor('#666')
        .text(`${user.firstName} ${user.lastName}`, 50, 170)
        .text(`${user.email}`, 50, 185)
        .text(`${user.phone || 'N/A'}`, 50, 200);

      // Adresse de livraison
      doc
        .fontSize(12)
        .fillColor('#333')
        .text('LIVRÉ À:', 300, 150)
        .fontSize(10)
        .fillColor('#666')
        .text(`${order.shippingAddress.address}`, 300, 170)
        .text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 300, 185)
        .text(`${order.shippingAddress.country || 'Tunisie'}`, 300, 200);

      // ==================== TABLEAU DES PRODUITS ====================
      let y = 250;

      // En-tête du tableau
      doc
        .fillColor('#667eea')
        .rect(50, y, 500, 30)
        .fill();

      doc
        .fontSize(10)
        .fillColor('#fff')
        .text('Produit', 60, y + 10)
        .text('Qté', 320, y + 10)
        .text('Prix Unit.', 380, y + 10)
        .text('Total', 480, y + 10);

      y += 30;

      // Lignes des produits
      let subtotal = 0;
      order.orderItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Ligne alternée (fond gris clair)
        if (index % 2 === 0) {
          doc
            .fillColor('#f8f9fa')
            .rect(50, y, 500, 25)
            .fill();
        }

        doc
          .fontSize(9)
          .fillColor('#333')
          .text(item.name.substring(0, 40), 60, y + 8)
          .text(item.quantity.toString(), 320, y + 8)
          .text(`${item.price.toFixed(2)} TND`, 380, y + 8)
          .text(`${itemTotal.toFixed(2)} TND`, 480, y + 8);

        y += 25;
      });

      // Ligne de séparation
      y += 10;
      doc
        .strokeColor('#ddd')
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();

      // ==================== TOTAUX ====================
      y += 15;

      // Sous-total
      doc
        .fontSize(10)
        .fillColor('#666')
        .text('Sous-total:', 380, y)
        .fillColor('#333')
        .text(`${subtotal.toFixed(2)} TND`, 480, y);

      y += 20;

      // Frais de livraison
      const shippingCost = order.shippingPrice || 7.00;
      doc
        .fillColor('#666')
        .text('Frais de livraison:', 380, y)
        .fillColor('#333')
        .text(`${shippingCost.toFixed(2)} TND`, 480, y);

      y += 20;

      // Remise (si applicable)
      if (order.discountAmount && order.discountAmount > 0) {
        doc
          .fillColor('#10b981')
          .text('Remise:', 380, y)
          .text(`-${order.discountAmount.toFixed(2)} TND`, 480, y);
        y += 20;
      }

      // Ligne de séparation avant total
      doc
        .strokeColor('#667eea')
        .lineWidth(2)
        .moveTo(370, y)
        .lineTo(550, y)
        .stroke();

      y += 15;

      // TOTAL FINAL
      doc
        .fontSize(14)
        .fillColor('#667eea')
        .text('TOTAL:', 380, y)
        .fontSize(16)
        .text(`${order.totalPrice.toFixed(2)} TND`, 460, y);

      // ==================== INFORMATIONS DE PAIEMENT ====================
      y += 50;

      doc
        .fontSize(10)
        .fillColor('#333')
        .text('Mode de paiement:', 50, y)
        .fillColor('#666')
        .text(order.paymentMethod === 'card' ? 'Carte bancaire' : 'Paiement à la livraison', 160, y);

      y += 20;

      doc
        .fillColor('#333')
        .text('Statut de paiement:', 50, y)
        .fillColor(order.isPaid ? '#10b981' : '#ef4444')
        .text(order.isPaid ? '✓ Payé' : '✗ En attente', 160, y);

      if (order.isPaid && order.paidAt) {
        y += 20;
        doc
          .fillColor('#333')
          .text('Date de paiement:', 50, y)
          .fillColor('#666')
          .text(new Date(order.paidAt).toLocaleDateString('fr-FR'), 160, y);
      }

      // ==================== PIED DE PAGE ====================
      const pageHeight = doc.page.height;
      const footerY = pageHeight - 80;

      doc
        .fontSize(8)
        .fillColor('#999')
        .text('Merci pour votre achat !', 50, footerY, { align: 'center', width: 500 })
        .text('Pour toute question, contactez-nous à ayarirayen539@gmail.com', 50, footerY + 15, { align: 'center', width: 500 })
        .text('© 2025 E-commerce Store - Tous droits réservés', 50, footerY + 30, { align: 'center', width: 500 });

      // Finaliser le PDF
      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

export default generateInvoicePDF;
