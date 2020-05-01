const router = require('express').Router();
const Post = require('../model/Post'); // DB posts
const User = require('../model/User'); // DB utenti
const DeletedPost = require('../model/DeletedPost'); // DB post eliminati
const mongoose = require('mongoose');
const { postValidation } = require('../validation');
const { dateTrimmer, timeTrimmer, getCurrentDate, getCurrentTime } = require('../functions/timeFunctions');
const { removeA } = require('../functions/commonFunctions');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');


// Definizione delle varie routes per i post


// get tutti i post
router.get('/', verifyToken, async (req, res) => {

    try{
        const posts = await Post.find();
        res.json(posts.reverse()); // per i post in ordine cronologico
    }catch(err){
        res.json({ message: err });
    }

});


// get post specifico
router.get('/:postID', verifyToken, async (req, res) => {

    const post = await Post.findOne({postID: req.params.postID});
    if( ! post) res.status(404).send('ERROR: post [' + req.params.postID + '] not found');

    res.json(post);

});


// crea un nuovo post e aggiorna postsCreated dell'user che lo crea
router.post('/', verifyToken, async (req, res) => {

    req.body.dateOfEvent = dateTrimmer(req.body.dateOfEvent); // formatta data
    req.body.timeOfEvent = timeTrimmer(req.body.timeOfEvent); // formatta ora

    const { error } = postValidation(req.body); // post validation -> joi
    if(error) res.status(400).send(error.details[0].message);

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET); // decoding jwt

    const user = await User.findOne({userID: decoded.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');

    const appDateOfPublishing = getCurrentDate();
    const appTimeOfPublishing = getCurrentTime();

    // CREAZIONE NUOVO POST
    const post = new Post({

        publisher: user.username,

        activity: req.body.activity,
        title: req.body.title,
        details: req.body.details,
        place: req.body.place,
        maxPartecipants: req.body.maxPartecipants,

        dateOfEvent: req.body.dateOfEvent,
        timeOfEvent: req.body.timeOfEvent,

        dateOfPublishing: appDateOfPublishing,
        timeOfPublishing: appTimeOfPublishing

    });

    const savedPost = await post.save();
    if( ! savedPost) res.status(500).send('SERVER ERROR: couldn\'t save the post');

    // aggiorna array user
    user.postsCreated.push(savedPost.postID);

    const savedUser = await user.save();
    if( ! savedUser) res.status(500).send('SERVER ERROR: couldn\'t update the user\'s post list');

    res.send('SUCCESS: user [' + savedUser.username + '] created post with id [' + savedPost.postID + ']');

});


// partecipa e aggiorna postsPartecipating dell'utente che partecipa
router.patch('/:postID/join', verifyToken, async (req, res) => {

    const post = await Post.findOne({postID: req.params.postID});
    if( ! post) res.status(404).send('ERROR: post [' + req.params.postID + '] not found');
 
    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

    const user = await User.findOne({userID: decoded.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');
 
    if(post.partecipants.includes(user.username)) return res.status(400).send('ERROR: user [' + user.username + '] already partecipating');
    if(post.partecipants.length >= post.maxPartecipants) return res.status(400).send('ERROR: post with id [' + post.postID +'] is full');
 
    // partecipa al post
    post.partecipants.push(user.username);

    const savedPost = await post.save();
    if( ! savedPost) res.status(500).send('ERROR: couldn\'t update the post');

    // aggiorna array user
    user.postsPartecipating.push(savedPost.postID);

    const savedUser = await user.save();
    if( ! savedUser) res.status(500).send('ERROR: couldn\'t update the user\'s post list');

    res.send('SUCCESS: user [' + savedUser.username + '] is now partecipating to post with id [' + savedPost.postID + ']');

});


// "departecipa" al post e aggiorna postsPartecipating dell'utente
router.patch('/:postID/leave', verifyToken, async (req, res) => {

    const post = await Post.findOne({postID: req.params.postID});
    if( ! post) res.status(404).send('ERROR: post [' + req.params.postID + '] not found');
 
    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

    const user = await User.findOne({userID: decoded.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');
 
    if( ! post.partecipants.includes(user.username)) return res.status(400).send('ERROR: user [' + user.username + '] is not partecipating');

    // departecipa al post
    removeA(post.partecipants, user.username);

    const savedPost = await post.save();
    if( ! savedPost) res.status(500).send('ERROR: couldn\'t update the post');

    // aggiorna array user
    removeA(user.postsPartecipating, savedPost.postID);

    const savedUser = await user.save();
    if( ! savedUser) res.status(500).send('ERROR: couldn\'t update the user\'s post list');

    res.send('SUCCESS: user [' + savedUser.username + '] leaved the post with id [' + savedPost.postID + ']');

});


// elimina collezione post
router.delete('/', verifyToken, isAdmin, async (req, res) => {

    try{
        mongoose.connection.db.dropCollection('posts', () => {

            console.log("SUCCESS: admin [" + req.decoded.username + "] DELETED posts collection");
            res.send("SUCCESS: admin [" + req.decoded.username + "] DELETED posts collection");
    
        });
    }catch(err){
        console.log("erorr while dropping posts collection" + err);
    }

});


// elimina post specifico
router.delete('/:postID', verifyToken, async (req, res) => {

    const post = await Post.findOne({postID: req.params.postID});
    if( ! post) res.status(404).send('ERROR: post [' + req.params.postID + '] not found');

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

    const maybeAdmin = await User.findOne({userID: decoded.userID});

    if(maybeAdmin.isAdmin){

        try{
            moveToTrash(post);
            post.delete();
    
            res.send('SUCCESS: admin [' + maybeAdmin.username +'] deleted post with id [' + post.postID  + ']');
        }catch(err){
            console.log("admin error while deleting specific post" + err);
        }

    } else if(decoded.username == post.publisher){

        try{
            moveToTrash(post);
            post.delete();
    
            res.send('SUCCESS: admin [' + maybeAdmin.username +'] deleted post with id [' + post.postID  + ']');
        }catch(err){
            console.log("user error while deleting specific post" + err);
        }

    } else {
        res.status(401).send('ERROR: user [' + maybeAdmin.username + '] is not authorized to delete post with id [' + post.postID + ']');
    }
    
});


// =========================================================================================================================================


async function moveToTrash(postToDelete){

    const appDateOfDeleting = getCurrentDate();
    const appTimeOfDeleting = getCurrentTime();
    
    const deleted = new DeletedPost({

        publisher: postToDelete.username,

        activity: postToDelete.activity,
        title: postToDelete.title,
        details: postToDelete.details,
        place: postToDelete.place,
        maxPartecipants: postToDelete.maxPartecipants,

        dateOfEvent: postToDelete.dateOfEvent,
        timeOfEvent: postToDelete.timeOfEvent,

        dateOfPublishing: postToDelete.dateOfPublishing,
        timeOfPublishing: postToDelete.timeOfPublishing,

        dateOfDeleting: appDateOfDeleting,
        timeOfDeleting: appTimeOfDeleting,

        deadPostID: postToDelete.postID

    });

    const deletedPost = await deleted.save();
    if( ! deletedPost) res.status(500).send("SERVER ERROR: couldn't move the post to delete in the trashbin");

}


module.exports = router;