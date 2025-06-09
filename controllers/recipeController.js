const Recipe = require('../models/Recipe');

exports.createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const image = req.file ? req.file.path : null;

    if (!title || !ingredients || !instructions || !image) {
      return res.status(400).json({ message: 'Bütün sahələr doldurulmalıdır' });
    }

    const newRecipe = await Recipe.create({
      title,
      ingredients: ingredients.split(',').map(i => i.trim()),
      instructions,
      image,
      user: req.user.id
    });

    res.status(201).json({ message: 'Recipe yaradıldı', recipe: newRecipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server xətası' });
  }
};

exports.searchRecipes = async (req, res) => {
  const { ingredients } = req.query;

  if (!ingredients) {
    return res.status(400).json({ message: 'Ingredient yazılmalıdır' });
  }

  const ingredientArray = ingredients
    .split(',')
    .map((i) => i.trim().toLowerCase());

  try {
    const recipes = await Recipe.find({
      ingredients: { $in: ingredientArray }
    });

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server xətası' });
  }
};
