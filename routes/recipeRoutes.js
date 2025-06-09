const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../middlewares/upload');

router.post('/', verifyToken, upload.single('image'), recipeController.createRecipe);
router.get('/search', verifyToken, recipeController.searchRecipes);

module.exports = router;
