const mongoose = require('mongoose');
const Rating = require('./Rating');
const AutoIncrement = require('mongoose-sequence')(mongoose);
// Questo è il formato dell'utente in mongodb

const userSchema = new mongoose.Schema({

    // Unico parametro che non è possibile specificare con una chiamata. Va impostato manualmente modificando il record di mongodb.
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },

    // user -> form
    username: {
        type: String,
        min: 3,
        max: 24,
        required: true
    },

    // user -> form
    email: {
        type: String,
        min: 4,
        max: 128,
        required: true
    },

    // user -> form
    password: {
        type: String,
        min: 8,
        max: 512,
        required: true
    },

    // auto -> vengono aggiunti gli id dei post creati
    postsCreated: {
        type: [Number],
    },

    // auto -> vengono aggiunti gli id dei post ai quali si partecipa
    postsPartecipating: {
        type: [Number],
    },

    // Viene utilizzato per calcolare la media.
    allRatings: {
        type: [Rating] // è un array di oggetti {utente, voto}
    },

    // auto -> la media dei voti salvati in allRatings viene salvata qui.
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    
    // auto
    registerDate: {
        type: String,
    },

    registerTime: {
        type: String,
    }

});


// Campo userID, questo plugin permette di effettuarne l'auto incremento ogni volta che viene creato un nuovo utente
userSchema.plugin(AutoIncrement,  {inc_field: 'userID'});


module.exports = mongoose.model('User', userSchema);