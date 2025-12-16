const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// GET - Récupérer tous les commentaires d'un article
router.get('/article/:articleId', async (req, res) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Ajouter un commentaire
router.post('/', async (req, res) => {
  const comment = new Comment({
    articleId: req.body.articleId,
    author: req.body.author,
    content: req.body.content
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer un commentaire
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    
    await comment.deleteOne();
    res.json({ message: 'Commentaire supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Compter les commentaires d'un article
router.get('/count/:articleId', async (req, res) => {
  try {
    const count = await Comment.countDocuments({ articleId: req.params.articleId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;