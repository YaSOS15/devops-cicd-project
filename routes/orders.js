const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET - Toutes les commandes
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Statistiques des commandes
router.get('/stats', async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Une commande par ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Créer une commande
router.post('/', async (req, res) => {
  try {
    // Vérifier et mettre à jour le stock
    for (let item of req.body.items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.name} non trouvé` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
      }
      
      product.stock -= item.quantity;
      await product.save();
    }
    
    const order = new Order({
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Modifier le statut d'une commande
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (req.body.status) {
      order.status = req.body.status;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer une commande
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    await order.deleteOne();
    res.json({ message: 'Commande supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;