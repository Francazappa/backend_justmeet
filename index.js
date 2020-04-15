const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');


// middlewares
app.use(express.json());
app.use(cors());


// imported routes
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');


// route middlewares
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);


app.get('/', (req, res) => {
    res.send('home route');
});


// db connection ==================================================================
mongoose.connect(
    process.env.DB_CONNECTION_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to DB!')
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// =================================================================================


// server port
const port = process.env.PORT;
app.listen(port, () => console.log('server listening on port ' + port));