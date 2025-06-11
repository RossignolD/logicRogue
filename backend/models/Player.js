const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid

const playerSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  username: { type: String, required: true, unique: true }, // A human-readable username
  passwordHash: { type: String, required: true }, // Store the hashed password
  inventory: { type: [String], default: [] }, // Array of item IDs
  spellbook: { type: [String], default: [] }, // Array of spell IDs/names
  currentLocation: { type: {x, y}, default: {x:0, y:0} },
  currentScene: { type: String, default: "" },
  solvedPuzzles: { type: [String], default: [] }, // Now stores IDs of solved LogicPuzzles
}, { _id: false }); 

playerSchema.methods.toJSON = function() {
    const playerObject = this.toObject();
    delete playerObject.passwordHash; // Exclude password hash from API responses
    return playerObject;
};

module.exports = mongoose.model('Player', playerSchema);