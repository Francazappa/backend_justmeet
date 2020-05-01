const router = require('express').Router();
const User = require('../model/User');
const Post = require('../model/Post');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
const { getCurrentDate, getCurrentTime } = require('../functions/timeFunctions');
const verifyToken = require('../middlewares/verifyToken');
const bcrypt = require('bcryptjs');
const isAdmin = require('../middlewares/isAdmin');


// Definizione delle varie routes per gli users


// ottieni un json con tutti gli utenti
router.get('/', verifyToken, async (req, res) => {

    try{
        const users = await User.find();
        res.json(users);
    } catch(err){
        res.json({ message: err });
    }

});


// ottieni profilo utente corrente
router.get('/profile', verifyToken, async (req, res) => {

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET); // decoding jwt

    const user = await User.findOne({userID: decoded.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');

    try{
        await postsCleaner(user);
    }catch{
        res.status(500).send("SERVER ERROR: couldn't update postsCreated or postsPartecipating");
    }

    res.json(user);

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

    // CONTROLLO USERNAME IN USO: controlla se c'è già un utente con quel username
    const usernameExists = await User.findOne({username: req.body.username});
    if(usernameExists) return res.status(400).send('ERROR: username [' + req.body.username + '] already in use');

    // CONTROLLO EMAIL IN USO: controlla se la email è già presente nel db
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('ERROR: email [' + req.body.email + '] already in use');

    // PASSWORD HASHING: tramite hash + salt
    const salt = await bcrypt.genSalt(10); // generating salt (10 = complexity of generated string)
    const hashedPassword  = await bcrypt.hash(req.body.password, salt); // hashing pw with salt

    const appRegisterDate = getCurrentDate();
    const appRegisterTime = getCurrentTime();

    // CREAZIONE NUOVO UTENTE:
    const user = new User({

        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,

        registerDate: appRegisterDate,
        registerTime: appRegisterTime

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

    // CONTROLLO UTENTE GIA' REGISTRATO: controlla se l'username è nel db
    const user = await User.findOne({username: req.body.username});
    if( ! user) return res.status(400).send('ERROR: username is wrong');

    // CONTROLO PASSWORD: compara la pw nel body con quella cripatata nel db tramite bcrypt
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if( ! validPass) return res.status(400).send('ERROR: password is wrong');
    
    // CREAZIONE E ASSEGNAZIONE JWT: se l'utente è in possesso del token può fare azioni -> private routes middlewares
    const token = jwt.sign({ userID: user.userID, username: user.username }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});


// elimina utente specifico
router.delete('/:userID', verifyToken, isAdmin, async (req, res) => {

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET); // decoding jwt
    const maybeAdmin = await User.findOne({userID: decoded.userID});

    const user = await User.findOne({userID: req.params.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');

    if(maybeAdmin.userID == user.userID) return res.status(400).send("ERROR: cannot delete admin");

    try{
        user.delete();
        res.send('SUCCESS: admin [' + req.decoded.username +'] deleted user with id [' + user.userID + ']');
    }catch(err){
        return res.send("ERROR: couldn't delete user" + err);
    }

});


// elimina collezione utenti
router.delete('/', verifyToken, isAdmin, async (req, res) => {

    try{
        mongoose.connection.db.dropCollection('users', () => {
            console.log("SUCCESS: admin [" + req.decoded.username + "] DELETED users collection");
            res.send("SUCCESS: admin [" + req.decoded.username + "] DELETED users collection");
        });
    }catch(err){
        return res.send("ERROR: couldn't drop user collection" + err);
    }

});


// =========================================================================================================================================


// aggiorna postsCreated e postsPartecipating di un utente con i post esistenti (rimuove quelli inesistenti)
async function postsCleaner(user){
    
    const newArr1 = [];
    const newArr2 = [];

    // creo newArr1 con i postsCreated che esistono
    for(i = 0; i < user.postsCreated.length; i++){
        
        const post = await Post.find({postID: user.postsCreated[i]});
        if( post.length > 0) newArr1.push(user.postsCreated[i]);

    }

    // creo newArr2 con i postsPartecipating che esistono
    for(i = 0; i < user.postsPartecipating.length; i++){
        
        const post = await Post.find({postID: user.postsPartecipating[i]});
        if( post.length > 0) newArr2.push(user.postsPartecipating[i]);

    }

    // aggiorno gli array dell'user
    user.postsCreated = newArr1;
    user.postsPartecipating = newArr2;

    try{
        await user.save();
    }catch(err){
        console.log("postsCleaner error");
    }

}


module.exports = router;