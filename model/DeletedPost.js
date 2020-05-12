const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

/* 
"extends" post, aggiunge questi 3 campi:

    - dateOfDeleting: String,
    - timeOfDeleting: String,
    - deadPostID: Number
*/

const deletedPostSchema = new mongoose.Schema({

    publisher: String,

    activity: String,

    title: String,

    details: String,

    place: String,
    
    maxPartecipants: Number,

    dateOfEvent: String,

    timeOfEvent: String,

    dateOfPublishing: String,

    timeOfPublishing: String,

    dateOfDeleting: String,

    timeOfDeleting: String,

    deadPostID: Number

});

deletedPostSchema.plugin(AutoIncrement,  {inc_field: 'deletedPostID'});


module.exports = deletedPostSchema;
module.exports = mongoose.model('DeletedPost', deletedPostSchema);