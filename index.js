const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');


console.log('\n' + '----- | JUST MEET\'S SERVER | -----' + '\n');


// middlewares
app.use(express.json());
app.use(cors());


// imported routes
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const ratingRoute = require('./routes/rating');
const deletedRoute = require('./routes/deleted');


// route middlewares
app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);
app.use('/api/rating', ratingRoute);
app.use('/api/deleted', deletedRoute);


// db connection ==================================================================
mongoose.connect(
    process.env.DB_CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
    () => console.log('- connected to data base')
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// =================================================================================


// server port
const port = process.env.PORT;
app.listen(port, () => console.log('- listening on port ' + port));