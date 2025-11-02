import mongoose from 'mongoose';

const abandonedCartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  totalValue: {
    type: Number,
    required: true,
    default: 0
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date
  },
  converted: {
    type: Boolean,
    default: false
  },
  convertedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
abandonedCartSchema.index({ user: 1, createdAt: -1 });
abandonedCartSchema.index({ emailSent: 1, createdAt: -1 });

// Méthode pour calculer la valeur totale du panier
abandonedCartSchema.methods.calculateTotal = function() {
  this.totalValue = this.cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  return this.totalValue;
};

const AbandonedCart = mongoose.model('AbandonedCart', abandonedCartSchema);

export default AbandonedCart;
