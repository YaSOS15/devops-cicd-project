const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Comment = require('../models/Comment');

// GET - Récupérer tous les articles (avec pagination et filtres)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    
    let query = { published: true };
    
    if (category && category !== 'Toutes') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await Article.countDocuments(query);
    
    res.json({
      articles,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Articles populaires
router.get('/popular', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ views: -1 })
      .limit(5);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Articles récents
router.get('/recent', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Statistiques
router.get('/stats', async (req, res) => {
  try {
    const total = await Article.countDocuments();
    const published = await Article.countDocuments({ published: true });
    const draft = total - published;
    const totalViews = await Article.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);
    
    const categoryCounts = await Article.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total,
      published,
      draft,
      totalViews: totalViews[0]?.total || 0,
      categoryCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Un article par slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    
    // Incrémenter les vues
    article.views += 1;
    await article.save();
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Créer un article
router.post('/', async (req, res) => {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
    excerpt: req.body.excerpt,
    category: req.body.category,
    author: req.body.author || 'Admin',
    tags: req.body.tags || [],
    imageUrl: req.body.imageUrl,
    published: req.body.published !== false
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH - Modifier un article
router.patch('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        article[key] = req.body[key];
      }
    });

    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer un article
router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    
    // Supprimer aussi tous les commentaires associés
    await Comment.deleteMany({ articleId: req.params.id });
    
    await article.deleteOne();
    res.json({ message: 'Article supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Liker un article
router.post('/:id/like', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    
    article.likes += 1;
    await article.save();
    
    res.json({ likes: article.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;