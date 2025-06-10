const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../middlewares/upload');
const Recipe = require('../models/Recipe'); // <-- Əlavə etdin

router.post('/', verifyToken, upload.single('image'), recipeController.createRecipe);
router.get('/search', verifyToken, recipeController.searchRecipes);

router.get('/', async (req, res) => {
  const { ingredient } = req.query;

  let filter = {};

  if (ingredient) {
    const ingredientsArray = ingredient.split(',').map(i => i.trim());
    filter = {
      ingredients: { $all: ingredientsArray }  // Bütün ingredientlər uyğun olmalıdır
    };
  }

  try {
    const recipes = await Recipe.find(filter);
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server xətası' });
  }
});


module.exports = router;

