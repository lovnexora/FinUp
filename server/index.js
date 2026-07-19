const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose'); // 🚀 MOVE THIS RIGHT HERE AT THE TOP
require('dotenv').config();

const Transaction = require('./models/transaction.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); 
app.use(express.json()); 

// Your connectDB function handles everything safely now:
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Connected Freshly');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

app.get('/server/test', (req, res) => {
    res.json({ body: 'test ok4' }); 
});

app.post('/server/transaction', async (req, res) => {
  try {
      await connectDB(); 
      const { name, description, datetime, price } = req.body;
      const transaction = await Transaction.create({ name, description, datetime, price });
      res.json(transaction);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/server/transactions', async (req, res) => {
  try {
      await connectDB(); 
      const transactions = await Transaction.find();
      res.json(transactions);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;