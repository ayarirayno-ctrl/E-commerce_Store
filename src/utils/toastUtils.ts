import toast from 'react-hot-toast';

/**
 * Toast Notification Utilities
 * Centralized toast notifications for consistent UX
 */

// Success notifications
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
  });
};

// Error notifications
export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
  });
};

// Info notifications
export const showInfoToast = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    duration: 3000,
  });
};

// Loading notifications
export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

// Dismiss loading toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Cart actions
export const toastCartActions = {
  added: (productName: string) => {
    toast.success(`${productName} ajouté au panier`, {
      icon: '🛒',
      duration: 2500,
    });
  },
  removed: (productName: string) => {
    toast.success(`${productName} retiré du panier`, {
      icon: '🗑️',
      duration: 2500,
    });
  },
  updated: () => {
    toast.success('Panier mis à jour', {
      icon: '✓',
      duration: 2000,
    });
  },
  cleared: () => {
    toast.success('Panier vidé', {
      icon: '🗑️',
      duration: 2500,
    });
  },
};

// Wishlist actions
export const toastWishlistActions = {
  added: (productName: string) => {
    toast.success(`${productName} ajouté aux favoris`, {
      icon: '❤️',
      duration: 2500,
    });
  },
  removed: (productName: string) => {
    toast.success(`${productName} retiré des favoris`, {
      icon: '💔',
      duration: 2500,
    });
  },
};

// Auth actions
export const toastAuthActions = {
  loginSuccess: (userName: string) => {
    toast.success(`Bienvenue ${userName} !`, {
      icon: '👋',
      duration: 3000,
    });
  },
  logoutSuccess: () => {
    toast.success('Déconnexion réussie', {
      icon: '👋',
      duration: 2500,
    });
  },
  registerSuccess: () => {
    toast.success('Compte créé avec succès !', {
      icon: '🎉',
      duration: 3000,
    });
  },
  verificationSent: () => {
    toast.success('Email de vérification envoyé', {
      icon: '📧',
      duration: 3500,
    });
  },
  passwordReset: () => {
    toast.success('Mot de passe réinitialisé avec succès', {
      icon: '🔒',
      duration: 3000,
    });
  },
};

// Order actions
export const toastOrderActions = {
  placed: (orderNumber: string) => {
    toast.success(`Commande ${orderNumber} confirmée !`, {
      icon: '✓',
      duration: 4000,
    });
  },
  updated: () => {
    toast.success('Commande mise à jour', {
      icon: '✓',
      duration: 2500,
    });
  },
  cancelled: () => {
    toast.success('Commande annulée', {
      icon: 'ℹ️',
      duration: 3000,
    });
  },
};

// Review actions
export const toastReviewActions = {
  added: () => {
    toast.success('Avis publié avec succès !', {
      icon: '⭐',
      duration: 3000,
    });
  },
  deleted: () => {
    toast.success('Avis supprimé', {
      icon: '🗑️',
      duration: 2500,
    });
  },
  helpful: () => {
    toast.success('Merci pour votre feedback !', {
      icon: '👍',
      duration: 2000,
    });
  },
};

// Network & Error actions
export const toastErrorActions = {
  networkError: () => {
    toast.error('Erreur de connexion. Vérifiez votre internet.', {
      duration: 5000,
    });
  },
  serverError: () => {
    toast.error('Erreur serveur. Réessayez plus tard.', {
      duration: 4000,
    });
  },
  validationError: (message: string) => {
    toast.error(message, {
      duration: 4000,
    });
  },
  unauthorized: () => {
    toast.error('Veuillez vous connecter pour continuer', {
      duration: 4000,
    });
  },
};

// Copy to clipboard
export const toastCopyActions = {
  copied: (text: string) => {
    toast.success(`${text} copié !`, {
      icon: '📋',
      duration: 2000,
    });
  },
};

// Form actions
export const toastFormActions = {
  saved: () => {
    toast.success('Modifications enregistrées', {
      icon: '✓',
      duration: 2500,
    });
  },
  submitted: () => {
    toast.success('Formulaire envoyé avec succès', {
      icon: '✓',
      duration: 3000,
    });
  },
};
