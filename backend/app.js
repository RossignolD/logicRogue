const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config()

const Player = require('./models/Player'); 

const app = express();
const port = 3000;


// Database Connection
console.log (process.env)
const MONGODB_URI = process.env.MONGODB_URI; 

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));


// Middleware
app.use(cors());
app.use(express.json()); // parsing JSON request bodies


/// --- Game State Management Endpoints ---


// POST /game/new - Start a new game (creates a new player)
app.post('/game/new', async (req, res) => {
    try {
        const { username, password, sprite } = req.body;

        if (!username || typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: 'Username is required to start a new game.' });
        }
        if (!password || typeof password !== 'string' || password.length < 6) { 
            return res.status(400).json({ message: 'Password is required and must be at least 6 characters long.' });
        }
        // if (sprite && typeof sprite !== 'string') {
        //     return res.status(400).json({ message: 'Sprite must be a string (URL or filename).' });
        // }

        const salt = await bcrypt.genSalt(10); 
        const passwordHash = await bcrypt.hash(password, salt); 

        // Create new player document with all required fields
        const newPlayer = new Player({
            username,
            passwordHash, 
           // sprite: sprite || 'player.png' 
        });
        await newPlayer.save(); 

        res.status(201).json({ message: 'New game started!', player: newPlayer });
    } catch (err) {
        if (err.code === 11000) { // MongoDB duplicate key error code for unique fields
            return res.status(409).json({ message: 'Username already exists. Please choose another or load game.' });
        }
        console.error(err);
        res.status(500).json({ message: 'Error starting new game.' });
    }
});

// POST /game/save - Save the current game state for a player
app.post('/game/save', async (req, res) => {
    const { playerId, playerData } = req.body;

    if (!playerId || !isValidUUID(playerId)) {
        return res.status(400).json({ message: 'Valid player ID is required to save game.' });
    }
    if (!playerData || typeof playerData !== 'object') {
        return res.status(400).json({ message: 'Player data is required to save game.' });
    }

    try {
        const updateFields = {
            level: playerData.level,
            experience: playerData.experience,
            inventory: playerData.inventory,
            spellbook: playerData.spellbook, 
            solvedPuzzles: playerData.solvedPuzzles,
            sprite: playerData.sprite 
        };

        const updatedPlayer = await Player.findByIdAndUpdate(
            playerId,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found for saving.' });
        }

        res.status(200).json({ message: 'Game saved successfully!', player: updatedPlayer });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ error: messages.join(', ') });
        }
        console.error(err);
        res.status(500).json({ message: 'Error saving game.' });
    }
});

// GET /game/save/:id - Load a saved game state by player ID
app.get('/game/save/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Saved game not found for this player ID.' });
        }
        res.status(200).json({ message: 'Game loaded successfully!', player: player });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error loading game.' });
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


//Game state management
app.post('/game/new', async (req, res) => {
    try {
        const { username, password, sprite } = req.body;

        if (!username || typeof username !== 'string' || username.trim() === '') {
            return res.status(400).json({ message: 'Username is required to start a new game.' });
        }
        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password is required and must be at least 6 characters long.' });
        }
        if (sprite && typeof sprite !== 'string') {
            return res.status(400).json({ message: 'Sprite must be a string (URL or filename).' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newPlayer = new Player({
            username,
            passwordHash,
            sprite: sprite || 'default_dragon_sprite.png'
        });
        await newPlayer.save();

        // The toJSON method in the Player model will automatically exclude passwordHash
        res.status(201).json({ message: 'New game started!', player: newPlayer });
    } catch (err) {
        if (err.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json({ message: 'Username already exists. Please choose another or load game.' });
        }
        console.error(err);
        res.status(500).json({ message: 'Error starting new game.' });
    }
});

app.post('/game/save', async (req, res) => {
    const { playerId, playerData } = req.body;

    if (!playerId || !isValidUUID(playerId)) {
        return res.status(400).json({ message: 'Valid player ID is required to save game.' });
    }
    if (!playerData || typeof playerData !== 'object') {
        return res.status(400).json({ message: 'Player data is required to save game.' });
    }

    try {
        const updateFields = {
            level: playerData.level,
            experience: playerData.experience,
            inventory: playerData.inventory,
            currentLocation: playerData.currentLocation,
            solvedPuzzles: playerData.solvedPuzzles,
            health: playerData.health,
            maxHealth: playerData.maxHealth,
            attackPower: playerData.attackPower,
            sprite: playerData.sprite, // Allow updating sprite
            spellbook: playerData.spellbook // Allow updating spellbook
        };

        const updatedPlayer = await Player.findByIdAndUpdate(
            playerId,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found for saving.' });
        }

        // The toJSON method in the Player model will automatically exclude passwordHash
        res.status(200).json({ message: 'Game saved successfully!', player: updatedPlayer });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ error: messages.join(', ') });
        }
        console.error(err);
        res.status(500).json({ message: 'Error saving game.' });
    }
});

app.get('/game/save/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Saved game not found for this player ID.' });
        }
        res.status(200).json({ message: 'Game loaded successfully!', player: player });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error loading game.' });
    }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


//post/game/new | UUID, username, password, sprite
//post/game/save | UUID, inv, username, password, sprite, spellbook, l
//get/game/save