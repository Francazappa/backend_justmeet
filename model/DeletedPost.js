const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const deletedPostSchema = new mongoose.Schema({

    publisher: {
        type: String,
    },
    
    activity: {
        type: String
    },

    title: {
        type: String
    },

    details: {
        type: String,
    },

    place: {
        type: String,
    },
    
    maxPartecipants: {
        type: Number,
    },

    dateOfEvent: {
        type: String,
    },

    timeOfEvent: {
        type: String,
    },

    dateOfPublishing: {
        type: String
    },

    timeOfPublishing: {
        type: String
    },

    dateOfDeleting: {
        type: String
    },

    timeOfDeleting: {
        type: String
    },

    deadPostID: {
        type: Number
    }


});

deletedPostSchema.plugin(AutoIncrement,  {inc_field: 'deletedPostID'});

module.exports = deletedPostSchema;
module.exports = mongoose.model('DeletedPost', deletedPostSchema);
