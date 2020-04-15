const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation, ratingValidation } = require('../validation');
const verifyToken = require('../middlewares/verifyToken');
//const verifyRating = require('../middlewares/verifyRating');
const bcrypt = require('bcryptjs');

// Definizione delle varie routes per gli utenti

// ottieni un json con tutti gli utenti
router.get('/', verifyToken, async (req, res) => {

    try{
        const users = await User.find();
        res.json(users);
    } catch(err){
        res.json({ message: err });
    }

});


// ottieni uno specifico utente tramite id
router.get('/:userID', verifyToken, async (req, res) => {

    const user = await User.findOne({userID: req.params.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');

    res.json(user);

});


// registrazione
router.post('/register', async (req, res) => {
    
    // REGISTER VALIDATION: controlla se vengono rispettati i criteri definiti con joi in validation.js
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // CONTROLLO USERNAME IN USO: controlla se c'è già un utente con quel nickname
    const nicknameExists = await User.findOne({nickname: req.body.nickname});
    if(nicknameExists) return res.status(400).send('ERROR: nickname [' + req.body.nickname + '] already in use');

    // CONTROLLO EMAIL IN USO: controlla se la email è già presente nel db
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('ERROR: email [' + req.body.email + '] already in use');

    // PASSWORD HASHING: tramite hash + salt
    const salt = await bcrypt.genSalt(10); // generating salt (10 = complexity of generated string)
    const hashedPassword  = await bcrypt.hash(req.body.password, salt); // hashing pw with salt

    // CREAZIONE NUOVO UTENTE:
    const user = new User({

        nickname: req.body.nickname,
        email: req.body.email,
        password: hashedPassword

    });

    try{
        const savedUser = await user.save();
        res.send('SUCCESS: user with id [' + savedUser.userID + '] created');
    }catch(err){
        res.status(400).send(err);
    }

});


// login
router.post('/login', async (req, res) => {

    // LOGIN VALIDATION
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // CONTROLLO UTENTE GIA' REGISTRATO: controlla se la mail è nel db
    const user = await User.findOne({email: req.body.email});
    if( ! user) return res.status(400).send('ERROR: email is wrong');

    // CONTROLO PASSWORD: compara la pw nel body con quella cripatata nel db tramite bcrypt
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if( ! validPass) return res.status(400).send('ERROR: password is wrong');
    
    // CREAZIONE E ASSEGNAZIONE JWT: se l'utente è in possesso del token può fare azioni -> private routes middlewares
    const token = jwt.sign({ userID: user.userID, nickname: user.nickname }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});


// ritorna l'array dei post creati dallo specifico utente
router.get('/:userID/postsCreated', verifyToken, async (req, res) => {

    const user = await User.findOne({userID: req.params.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');

    // 204 OK, ma non ritorna contenuto
    if(user.postsCreated.length == 0) return res.status(204).send();

    res.json(user.postsCreated);

});


// ritorna l'array dei post ai quali uno specifico utente partecipa
router.get('/:userID/postsPartecipating', verifyToken, async (req, res) => {

    const user = await User.findOne({userID: req.params.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');

    // 204 OK, ma non ritorna contenuto
    if(user.postsPartecipating.length == 0) return res.status(204).send();

    res.json(user.postsPartecipating);

});


// dare un rating ad uno specifico utente, FARE IN MODO CHE UN UTENTE POSSA DARE SOLO UN VOTO PER POST?????????? FARE IN MODO CHE UN UTENTE POSSA DARE SOLO UN VOTO PER POST?????????? FARE IN MODO CHE UN UTENTE POSSA DARE SOLO UN VOTO PER POST??????????
//router.post('/:userID/rating', verifyToken, verifyRating, async (req, res) => {
router.post('/:userID/rating', verifyToken, async (req, res) => {

    const user = await User.findOne({userID: req.params.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');

    // RATING VALIDATION
    const { error } = ratingValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
    // metto il rating dentro l'array dei rating
    user.allRatings.push(req.body.rating);

    // media dei rating contenuti nell'array allRatings
    avg = user.allRatings.reduce((a, b) => a + b, 0)/user.allRatings.length;
    avg = avg.toFixed(1); // 1 numero dopo la virgola

    user.rating = avg;

    try{
        const savedUser = await user.save();
        res.send('SUCCESS: user [' + savedUser.nickname + '] has now an average rating of [' + savedUser.rating + ']');
    }catch(err){
        res.status(400).send(err);
    }

});

// dare un rating ad uno specifico utente, FARE IN MODO CHE UN UTENTE POSSA DARE SOLO UN VOTO PER POST?????????? FARE IN MODO CHE UN UTENTE POSSA DARE SOLO UN VOTO PER POST?????????? FARE IN MODO CHE UN UTENTE POSSA DARE SOLO UN VOTO PER POST??????????
//router.post('/rating', verifyToken, verifyRating, async (req, res) => {
router.post('/rating', verifyToken, async (req, res) => {

    const user = await User.findOne({userID: req.params.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');

    // RATING VALIDATION
    const { error } = ratingValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
    // metto il rating dentro l'array dei rating
    user.allRatings.push(req.body.rating);

    // media dei rating contenuti nell'array allRatings
    avg = user.allRatings.reduce((a, b) => a + b, 0)/user.allRatings.length;
    avg = avg.toFixed(1); // 1 numero dopo la virgola

    user.rating = avg;

    try{
        const savedUser = await user.save();
        res.send('SUCCESS: user [' + savedUser.nickname + '] has now an average rating of [' + savedUser.rating + ']');
    }catch(err){
        res.status(400).send(err);
    }

});



// ottieni il rating di uno specifico utente
router.get('/:userID/rating', verifyToken, async (req, res) => {

    const user = await User.findOne({userID: req.params.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');

    res.json(user.rating);

});

module.exports = router;