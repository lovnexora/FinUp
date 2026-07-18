const express = require('express');
const cors = require('cors'); // 1. Import cors
require('dotenv').config();

const Transaction = require('./models/transaction.js');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors()); // 2. Enable CORS for all routes (Must be BEFORE routes)
app.use(express.json()); // 3. Enable JSON parsing (You had this commented out!)

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Connection Error:', err));

app.get('/server/test', (req, res) => {
    res.json({ body: 'test ok4' }); 
});

app.post('/server/transaction',async (req, res) => {
   
  const {name,description,datetime,price} = req.body;
  const transaction = await Transaction.create({name,description,datetime,price});


    res.json(transaction);
});

app.get('/server/transactions', async (req, res) => {
  try {
      const transactions = await Transaction.find();
      res.json(transactions);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});   