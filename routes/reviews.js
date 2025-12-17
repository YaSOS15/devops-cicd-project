const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');

// GET - Tous les avis d'un produit
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Ajouter un avis
router.post('/', async (req, res) => {
  try {
    const review = new Review({
      productId: req.body.productId,
      customerName: req.body.customerName,
      rating: req.body.rating,
      comment: req.body.comment
    });

    const newReview = await review.save();
    
    // Mettre à jour la note moyenne du produit
    const reviews = await Review.find({ productId: req.body.productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(req.body.productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length
    });
    
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer un avis
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }
    
    const productId = review.productId;
    await review.deleteOne();
    
    // Mettre à jour la note moyenne du produit
    const reviews = await Review.find({ productId });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length
    });
    
    res.json({ message: 'Avis supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;