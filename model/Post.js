const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

/*
Questo è il formato effettivo del post salvato su mongodb.

auto -> il sistema prende il dato automaticamente
user -> l'utente inserisce il dato nel form del frontend
*/

const postSchema = new mongoose.Schema({

    // auto
    publisher: {
        type: String,
        min: 4,
        max: 24,
        required: true
    },
    
    // user -> preso dalla lista delle attività predefinite
    activity: {
        type: String,
        min: 4,
        max: 128,
        required: true
    },

    // user -> form
    title: {
        type: String,
        min: 4,
        max: 64,
        required: true
    },

    // user -> form
    details: {
        type: String,
        min: 4,
        max:2024,
        // not required, i dettagli possono essere omessi qualora il titolo sia abbastastanza esplicativo
    },

    // user -> form
    place: {
        type: String,
        min: 4,
        max: 64,
        required: true
    },

    // auto -> array contente i nomi di chi partecipa al post
    partecipants: {
        type: [String],
        required: true
    },
    
    // user -> form int
    maxPartecipants: {
        type: Number,
        min: 1,
        max: 64,
        required: true
    },

    // user -> date picker
    dateOfEvent: {
        type: String,
        required: true
    },

    // user -> date picker
    timeOfEvent: {
        type: String,
        required: true
    },

    // auto -> data pubblicazione del post
    dateOfPublishing: {
        type: String
    },

    // auto -> data pubblicazione del post
    timeOfPublishing: {
        type: String
    }

});

// è il campo postID, questo plugin permette di effettuarne l'auto incremento ogni volta che viene creato un nuovo post
postSchema.plugin(AutoIncrement,  {inc_field: 'postID'});


module.exports = postSchema;
module.exports = mongoose.model('Post', postSchema);