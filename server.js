const express = require('express');

const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const infoRoutes = require('./routes/infoRoutes');
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

dotenv.config();

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/', infoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
