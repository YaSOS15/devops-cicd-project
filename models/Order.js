const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  status: {
    type: String,
    enum: ['En attente', 'Confirmée', 'Expédiée', 'Livrée', 'Annulée'],
    default: 'En attente'
  },
  paymentMethod: {
    type: String,
    default: 'Carte bancaire'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Générer un numéro de commande unique
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'CMD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);