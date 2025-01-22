const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const MONGO_URI = process.env.url;  
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Location schema and model
const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const Location = mongoose.model('Location', locationSchema);

// API Routes
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json({ locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/locations', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const newLocation = new Location({ latitude, longitude });
    await newLocation.save();
    res.status(201).json({ message: 'Location saved successfully', location: newLocation });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
