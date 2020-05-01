const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({

    // userID di chi vota
    votedBy: {
        type: Number,
        required: true
    },

    // voto dato
    vote: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    }

});

module.exports = ratingSchema;