require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();

// ✅ MongoDB ilə bağlantı
connectDB();
app.use(
  cors({
    origin: [/localhost:\d+$/], // bütün localhost portlara icazə verir
    credentials: true,
  })
);






app.use(express.json()); // JSON formatlı məlumatları qəbul et
app.use(cookieParser()); // Cookie-ləri oxumaq üçün
app.use('/uploads', express.static('uploads')); // Şəkillərin göstərilməsi üçün

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

// ✅ Serveri işə sal
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

