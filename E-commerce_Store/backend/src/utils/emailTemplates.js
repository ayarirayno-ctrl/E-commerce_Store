export const verificationEmailTemplate = (firstName, verificationUrl) => {
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
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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
          background: white; 
        }
        .button { 
          display: inline-block;
          background: #3b82f6;
          color: white !important;
          padding: 14px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
          text-align: center;
        }
        .button:hover {
          background: #2563eb;
        }
        .footer {
          background: #f9fafb;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        .divider {
          border-top: 1px solid #e5e7eb;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bienvenue chez E-commerce Store !</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${firstName} !</h2>
          <p>Merci de vous être inscrit sur notre boutique en ligne. Nous sommes ravis de vous compter parmi nous !</p>
          
          <p>Pour activer votre compte et commencer vos achats, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">
              ✅ Vérifier mon email
            </a>
          </div>
          
          <div class="divider"></div>
          
          <p style="font-size: 14px; color: #6b7280;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
            <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
          </p>
          
          <p style="font-size: 14px; color: #6b7280;">
            ⚠️ Ce lien expirera dans 24 heures.
          </p>
          
          <p style="font-size: 14px; color: #6b7280;">
            Si vous n'avez pas créé de compte sur E-commerce Store, vous pouvez ignorer cet email en toute sécurité.
          </p>
        </div>
        <div class="footer">
          <p>© 2025 E-commerce Store - Nabeul, Tunisia</p>
          <p>Contact: ayarirayen539@gmail.com | +216 94 816 735</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const welcomeEmailTemplate = (firstName) => {
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
          background: white; 
        }
        .feature {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 15px;
          margin: 15px 0;
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
          <h1>✅ Email vérifié avec succès !</h1>
        </div>
        <div class="content">
          <h2>Félicitations ${firstName} !</h2>
          <p>Votre compte a été activé avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités de notre boutique :</p>
          
          <div class="feature">
            <strong>🛍️ Shopping illimité</strong><br>
            Parcourez notre catalogue de plus de 50 produits
          </div>
          
          <div class="feature">
            <strong>💳 Paiement sécurisé</strong><br>
            Paiement par carte, PayPal ou à la livraison
          </div>
          
          <div class="feature">
            <strong>🚚 Livraison rapide</strong><br>
            Livraison partout en Tunisie sous 3-5 jours
          </div>
          
          <div class="feature">
            <strong>📦 Suivi de commandes</strong><br>
            Suivez vos commandes en temps réel
          </div>
          
          <p style="margin-top: 30px;">
            Commencez dès maintenant vos achats et profitez de nos offres exclusives !
          </p>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            Besoin d'aide ? Notre équipe est là pour vous :<br>
            📧 Email: ayarirayen539@gmail.com<br>
            📞 Téléphone: +216 94 816 735
          </p>
        </div>
        <div class="footer">
          <p>© 2025 E-commerce Store - Nabeul, Tunisia</p>
          <p>Merci de faire partie de notre communauté !</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const resetPasswordEmailTemplate = (firstName, resetUrl) => {
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
          margin: 40px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 40px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
          text-align: center;
        }
        .button:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        .warning-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
        .security-tip {
          background: #e3f2fd;
          border-left: 4px solid #2196F3;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Réinitialisation de Mot de Passe</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px;">Bonjour <strong>${firstName}</strong>,</p>
          
          <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte E-commerce Store.</p>
          
          <div class="warning-box">
            <strong>⏰ Attention !</strong><br>
            Ce lien est valide pendant <strong>30 minutes</strong> uniquement.
          </div>
          
          <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">
              Réinitialiser mon mot de passe
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            Ou copiez ce lien dans votre navigateur :<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <div class="security-tip">
            <strong>🛡️ Conseils de sécurité :</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
              <li>Ne partagez jamais ce lien avec personne</li>
              <li>Choisissez un mot de passe fort (8+ caractères, majuscules, chiffres, symboles)</li>
              <li>N'utilisez pas le même mot de passe sur plusieurs sites</li>
            </ul>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            <strong>Vous n'avez pas demandé cette réinitialisation ?</strong><br>
            Votre compte est en sécurité. Vous pouvez ignorer cet email en toute sécurité.
          </p>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            Besoin d'aide ? Contactez-nous :<br>
            📧 Email: ayarirayen539@gmail.com<br>
            📞 Téléphone: +216 94 816 735
          </p>
        </div>
        <div class="footer">
          <p>© 2025 E-commerce Store - Nabeul, Tunisia</p>
          <p>Cet email a été envoyé de manière automatique, merci de ne pas y répondre.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const orderShippedEmailTemplate = (order, user) => {
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
          margin: 40px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .status-badge {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          margin: 20px 0;
        }
        .order-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .tracking-box {
          background: #e3f2fd;
          border-left: 4px solid #2196F3;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Votre commande est en route !</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px;">Bonjour <strong>${user.firstName}</strong>,</p>
          
          <p>Bonne nouvelle ! Votre commande a été expédiée et est en route vers vous.</p>
          
          <div style="text-align: center;">
            <span class="status-badge">✓ EXPÉDIÉE</span>
          </div>
          
          <div class="order-info">
            <h3 style="margin-top: 0; color: #667eea;">Détails de la commande</h3>
            <p style="margin: 5px 0;"><strong>Numéro :</strong> ${order.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Date :</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            <p style="margin: 5px 0;"><strong>Total :</strong> ${order.totalPrice.toFixed(2)} TND</p>
          </div>
          
          <div class="tracking-box">
            <h3 style="margin-top: 0; color: #2196F3;">📍 Suivi de livraison</h3>
            <p style="font-size: 14px; margin: 10px 0;">
              Votre colis sera livré à l'adresse suivante :
            </p>
            <p style="font-weight: bold; margin: 10px 0;">
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 15px;">
              <strong>Délai de livraison estimé :</strong> 3-5 jours ouvrables
            </p>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>💡 Astuce :</strong> Assurez-vous qu'une personne soit présente à l'adresse de livraison pour réceptionner le colis.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            Questions ? Contactez-nous :<br>
            📧 Email: ayarirayen539@gmail.com<br>
            📞 Téléphone: +216 94 816 735
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

export const orderDeliveredEmailTemplate = (order, user) => {
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
          margin: 40px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .status-badge {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          margin: 20px 0;
        }
        .order-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .review-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
          text-align: center;
        }
        .button {
          display: inline-block;
          background: #f59e0b;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin-top: 10px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Commande livrée avec succès !</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px;">Bonjour <strong>${user.firstName}</strong>,</p>
          
          <p>Votre commande a été livrée ! Nous espérons que vous êtes satisfait(e) de votre achat.</p>
          
          <div style="text-align: center;">
            <span class="status-badge">✓ LIVRÉE</span>
          </div>
          
          <div class="order-info">
            <h3 style="margin-top: 0; color: #10b981;">Détails de la commande</h3>
            <p style="margin: 5px 0;"><strong>Numéro :</strong> ${order.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Date de commande :</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            <p style="margin: 5px 0;"><strong>Date de livraison :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            <p style="margin: 5px 0;"><strong>Total :</strong> ${order.totalPrice.toFixed(2)} TND</p>
          </div>
          
          <div class="review-box">
            <h3 style="margin-top: 0; color: #f59e0b;">⭐ Votre avis compte !</h3>
            <p style="font-size: 14px; margin: 10px 0;">
              Prenez quelques instants pour nous dire ce que vous pensez de vos produits.
            </p>
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="button">
              Laisser un avis
            </a>
          </div>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Un problème avec votre commande ?</strong><br>
              Contactez-nous dans les 14 jours pour un retour ou un échange.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            Service client disponible :<br>
            📧 Email: ayarirayen539@gmail.com<br>
            📞 Téléphone: +216 94 816 735
          </p>
        </div>
        <div class="footer">
          <p>© 2025 E-commerce Store - Nabeul, Tunisia</p>
          <p>Merci de votre confiance et à bientôt !</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const orderCancelledEmailTemplate = (order, user, reason) => {
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
          margin: 40px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .status-badge {
          display: inline-block;
          background: #ef4444;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          margin: 20px 0;
        }
        .order-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .refund-box {
          background: #dcfce7;
          border-left: 4px solid #10b981;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Commande annulée</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px;">Bonjour <strong>${user.firstName}</strong>,</p>
          
          <p>Nous vous informons que votre commande a été annulée.</p>
          
          <div style="text-align: center;">
            <span class="status-badge">ANNULÉE</span>
          </div>
          
          <div class="order-info">
            <h3 style="margin-top: 0; color: #ef4444;">Détails de la commande annulée</h3>
            <p style="margin: 5px 0;"><strong>Numéro :</strong> ${order.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Date :</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            <p style="margin: 5px 0;"><strong>Total :</strong> ${order.totalPrice.toFixed(2)} TND</p>
            ${reason ? `<p style="margin: 15px 0 5px 0;"><strong>Raison :</strong><br>${reason}</p>` : ''}
          </div>
          
          <div class="refund-box">
            <h3 style="margin-top: 0; color: #10b981;">💰 Remboursement</h3>
            <p style="font-size: 14px; margin: 10px 0;">
              Si vous avez déjà effectué le paiement, le remboursement sera traité dans les <strong>5-7 jours ouvrables</strong>.
            </p>
            <p style="font-size: 14px; margin: 10px 0;">
              Le montant sera crédité sur votre mode de paiement d'origine.
            </p>
          </div>
          
          <div style="background: #e0e7ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Vous souhaitez passer une nouvelle commande ?</strong><br>
              Consultez notre catalogue et profitez de nos offres !
            </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            Des questions ? Nous sommes là pour vous :<br>
            📧 Email: ayarirayen539@gmail.com<br>
            📞 Téléphone: +216 94 816 735
          </p>
        </div>
        <div class="footer">
          <p>© 2025 E-commerce Store - Nabeul, Tunisia</p>
          <p>Nous espérons vous revoir bientôt !</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const invoiceEmailTemplate = (order, user) => {
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
          margin: 40px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .invoice-badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          margin: 20px 0;
        }
        .order-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .attachment-box {
          background: #e3f2fd;
          border-left: 4px solid #2196F3;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
          text-align: center;
        }
        .download-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📄 Votre facture est prête</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px;">Bonjour <strong>${user.firstName}</strong>,</p>
          
          <p>Veuillez trouver ci-joint la facture de votre commande.</p>
          
          <div style="text-align: center;">
            <span class="invoice-badge">FACTURE N° ${order.orderNumber}</span>
          </div>
          
          <div class="order-info">
            <h3 style="margin-top: 0; color: #667eea;">Détails de la facture</h3>
            <p style="margin: 5px 0;"><strong>Numéro de commande :</strong> ${order.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Date :</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            <p style="margin: 5px 0;"><strong>Montant total :</strong> ${order.totalPrice.toFixed(2)} TND</p>
            <p style="margin: 5px 0;"><strong>Statut de paiement :</strong> ${order.isPaid ? '<span style="color: #10b981;">✓ Payé</span>' : '<span style="color: #ef4444;">✗ En attente</span>'}</p>
          </div>
          
          <div class="attachment-box">
            <div class="download-icon">📎</div>
            <h3 style="margin: 10px 0; color: #2196F3;">Facture en pièce jointe</h3>
            <p style="font-size: 14px; margin: 10px 0; color: #666;">
              Le fichier PDF de votre facture est joint à cet email.<br>
              Nom du fichier: <strong>facture-${order.orderNumber}.pdf</strong>
            </p>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>💡 Conseil :</strong> Conservez cette facture pour vos dossiers. Elle peut être nécessaire pour les retours ou les garanties.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            Questions sur votre facture ?<br>
            📧 Email: ayarirayen539@gmail.com<br>
            📞 Téléphone: +216 94 816 735
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

export const abandonedCartEmailTemplate = (cart, user) => {
  // Calculer le total du panier
  const cartTotal = cart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Générer la liste des produits
  const productsList = cart.cartItems.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
          <div>
            <p style="margin: 0; font-weight: 600; color: #333;">${item.name}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Quantité: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 15px; text-align: right; border-bottom: 1px solid #e5e7eb;">
        <p style="margin: 0; font-weight: bold; color: #667eea;">${(item.price * item.quantity).toFixed(2)} TND</p>
      </td>
    </tr>
  `).join('');

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
          margin: 40px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .cart-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
        }
        .total-box {
          background: #667eea;
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .cta-button {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 15px 40px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
          margin: 20px 0;
          text-align: center;
        }
        .urgency-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 Vous avez oublié quelque chose !</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px;">Bonjour <strong>${user.firstName}</strong>,</p>
          
          <p>Nous avons remarqué que vous avez laissé des articles dans votre panier. Ne les laissez pas vous échapper !</p>
          
          <div class="urgency-box">
            <p style="margin: 0; font-size: 14px;">
              <strong>⏰ Attention !</strong> Les articles de votre panier sont populaires et les stocks sont limités. Complétez votre commande maintenant pour ne pas les manquer !
            </p>
          </div>
          
          <h3 style="color: #667eea; margin-top: 30px;">Votre panier (${cart.cartItems.length} article${cart.cartItems.length > 1 ? 's' : ''})</h3>
          
          <table class="cart-table">
            ${productsList}
          </table>
          
          <div class="total-box">
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Total du panier</p>
            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold;">${cartTotal.toFixed(2)} TND</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/cart" class="cta-button">
              🛍️ FINALISER MA COMMANDE
            </a>
          </div>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>🎁 Offre spéciale :</strong> Livraison gratuite pour toute commande supérieure à 100 TND !
            </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px; text-align: center;">
            Besoin d'aide pour finaliser votre commande ?<br>
            📧 Email: ayarirayen539@gmail.com<br>
            📞 Téléphone: +216 94 816 735
          </p>
        </div>
        <div class="footer">
          <p>© 2025 E-commerce Store - Nabeul, Tunisia</p>
          <p>Vous recevez cet email car vous avez ajouté des articles à votre panier.</p>
          <p style="margin-top: 10px; font-size: 11px;">
            Si vous avez déjà finalisé votre commande, veuillez ignorer cet email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const newOrderAdminEmailTemplate = (order, user) => {
  const orderItems = order.orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong><br>
        <span style="font-size: 12px; color: #666;">Qté: ${item.quantity} × ${item.price.toFixed(2)} TND</span>
      </td>
      <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">
        <strong>${(item.quantity * item.price).toFixed(2)} TND</strong>
      </td>
    </tr>
  `).join('');

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
          margin: 40px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .alert-badge {
          display: inline-block;
          background: #ef4444;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          margin: 20px 0;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .info-box {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .order-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Nouvelle Commande Reçue !</h1>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <span class="alert-badge">ACTION REQUISE</span>
          </div>
          
          <p style="font-size: 16px;">Une nouvelle commande a été passée sur votre boutique.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #10b981;">Informations Client</h3>
            <p style="margin: 5px 0;"><strong>Nom :</strong> ${user.firstName} ${user.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email :</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>Téléphone :</strong> ${user.phone || 'N/A'}</p>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">Détails Commande</h3>
            <p style="margin: 5px 0;"><strong>N° Commande :</strong> ${order.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Date :</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')} à ${new Date(order.createdAt).toLocaleTimeString('fr-FR')}</p>
            <p style="margin: 5px 0;"><strong>Mode de paiement :</strong> ${order.paymentMethod === 'card' ? 'Carte bancaire' : 'Paiement à la livraison'}</p>
            <p style="margin: 5px 0;"><strong>Adresse de livraison :</strong><br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
            </p>
          </div>
          
          <h3 style="color: #667eea;">Articles commandés</h3>
          <table class="order-table">
            ${orderItems}
            <tr style="background: #667eea; color: white;">
              <td style="padding: 15px; font-weight: bold;">TOTAL</td>
              <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">
                ${order.totalPrice.toFixed(2)} TND
              </td>
            </tr>
          </table>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>⚡ Action requise :</strong> Connectez-vous au panneau d'administration pour traiter cette commande.
            </p>
          </div>
        </div>
        <div class="footer">
          <p>© 2025 E-commerce Store - Nabeul, Tunisia</p>
          <p>Notification automatique - Panneau Admin</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const lowStockAdminEmailTemplate = (products) => {
  const productsList = products.map(product => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center;">
          <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
          <div>
            <p style="margin: 0; font-weight: 600; color: #333;">${product.name}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Catégorie: ${product.category}</p>
          </div>
        </div>
      </td>
      <td style="padding: 15px; text-align: center; border-bottom: 1px solid #e5e7eb;">
        <span style="background: ${product.stock === 0 ? '#ef4444' : '#f59e0b'}; color: white; padding: 5px 15px; border-radius: 15px; font-weight: bold;">
          ${product.stock} ${product.stock === 0 ? '❌' : '⚠️'}
        </span>
      </td>
    </tr>
  `).join('');

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
          margin: 40px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .warning-badge {
          display: inline-block;
          background: #f59e0b;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          margin: 20px 0;
        }
        .stock-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Alerte Stock Bas</h1>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <span class="warning-badge">RÉAPPROVISIONNEMENT NÉCESSAIRE</span>
          </div>
          
          <p style="font-size: 16px;">Les produits suivants ont un stock faible ou sont en rupture de stock :</p>
          
          <table class="stock-table">
            <thead>
              <tr style="background: #667eea; color: white;">
                <th style="padding: 15px; text-align: left;">Produit</th>
                <th style="padding: 15px; text-align: center;">Stock</th>
              </tr>
            </thead>
            <tbody>
              ${productsList}
            </tbody>
          </table>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>💡 Recommandation :</strong> Réapprovisionnez ces produits rapidement pour éviter les ruptures de stock et maintenir vos ventes.
            </p>
          </div>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>📊 Statistique :</strong> ${products.length} produit${products.length > 1 ? 's' : ''} nécessite${products.length > 1 ? 'nt' : ''} une attention immédiate.
            </p>
          </div>
        </div>
        <div class="footer">
          <p>© 2025 E-commerce Store - Nabeul, Tunisia</p>
          <p>Alerte automatique - Gestion de stock</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const orderConfirmationEmailTemplate = (order, user) => {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #eee;">
            <div style="display: flex; align-items: center;">
              <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
              <div>
                <strong>${item.name}</strong><br>
                <span style="color: #666;">Qty: ${item.quantity}</span>
              </div>
            </div>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right;">
            <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
          </td>
        </tr>
      `
    )
    .join('');

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
          background: white; 
        }
        .order-info {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .order-info p {
          margin: 8px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .total-row {
          background: #f9fafb;
          font-weight: bold;
          font-size: 18px;
        }
        .footer { 
          background: #f9fafb; 
          padding: 20px; 
          text-align: center; 
          color: #666; 
          font-size: 14px; 
        }
        .success-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✅</div>
          <h1>Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
        </div>
        <div class="content">
          <h2>Hi ${user.name || 'Customer'},</h2>
          <p>Your order has been confirmed and will be shipped soon.</p>
          
          <div class="order-info">
            <p><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
            <p><strong>Payment Status:</strong> <span style="color: #10b981;">Paid</span></p>
          </div>

          <h3>Order Details</h3>
          <table>
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 15px; text-align: left;">Item</th>
                <th style="padding: 15px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td style="padding: 20px; text-align: left;">Total</td>
                <td style="padding: 20px; text-align: right; color: #10b981;">$${order.totalPrice.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <h3>Shipping Address</h3>
          <div class="order-info">
            <p><strong>${order.shippingAddress.fullName}</strong></p>
            <p>${order.shippingAddress.address}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
            <p>${order.shippingAddress.country}</p>
            ${order.shippingAddress.phone ? `<p>Phone: ${order.shippingAddress.phone}</p>` : ''}
          </div>

          <p style="margin-top: 30px;">
            We'll send you a shipping confirmation email as soon as your order ships.
          </p>

          <p>
            If you have any questions, feel free to contact our support team.
          </p>

          <p style="margin-top: 30px;">
            <strong>Thank you for shopping with us!</strong><br>
            The E-commerce Store Team
          </p>
        </div>
        <div class="footer">
          <p>© 2025 E-commerce Store - Nabeul, Tunisia</p>
          <p>Order #${order.orderNumber}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

