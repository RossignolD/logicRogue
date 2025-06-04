const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Player = require('./models/Player'); 
const Enemy = require('./models/Enemy'); 
const PuzzlePiece = require('./models/PuzzlePiece');

const app = express();
const port = 3000;


// Database Connection
const MONGODB_URI = 'mongodb://localhost:27017/rpg_game_db'; 

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));


// Middleware
app.use(cors());
app.use(express.json()); // parsing JSON request bodies


// Create new player (POST /players)
app.post('/players', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required to create a player.' });
    }

    const newPlayer = new Player({ username }); 
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    if (err.code === 11000) { 
        return res.status(409).json({ message: 'Username already taken.' });
    }
    console.error(err);
    res.status(500).json({ message: 'Error creating player.' });
  }
});


// Get player data (GET /players/:id)
app.get('/players/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id); // find by the UUID _id
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving player.' });
  }
});


// Update player location (POST /players/:id/move)
app.post('/players/:id/move', async (req, res) => {
  const { id } = req.params; // 'id' is the player's UUID _id
  const { newLocation } = req.body;

  try {
    const player = await Player.findById(id); 
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.currentLocation = newLocation;
    await player.save();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during movement.' });
  }
});


// Collect a puzzle piece (POST /players/:id/collect/:pieceId)
app.post('/players/:id/collect/:pieceId', async (req, res) => {
  const { id, pieceId } = req.params; 

  try {
    const player = await Player.findById(id); 
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const puzzlePiece = await PuzzlePiece.findById(pieceId); // ensure the piece exists
    if (!puzzlePiece) {
        return res.status(404).json({ message: 'Puzzle piece not found.' });
    }

    if (player.puzzlePieces.includes(pieceId)) {
       return res.status(400).json({ message: 'Player already has this puzzle piece.' });
    }

    player.puzzlePieces.push(pieceId);
    await player.save();

    res.json({ message: `Puzzle piece "${puzzlePiece.name}" collected!`, player: player });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error collecting puzzle piece.' });
  }
});


// Root route for sanity check
app.get('/', (req, res) => {
    res.send('RPG Game Backend is running!');
});


// 5. Error handling middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});