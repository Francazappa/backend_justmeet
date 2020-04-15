const router = require('express').Router();
const Post = require('../model/Post'); // DB posts
const User = require('../model/User'); // DB utenti
const { postValidation } = require('../validation');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');

// Definizione delle varie routes per i post

// get tutti i post
router.get('/', verifyToken, async (req, res) => {

    try{
        const posts = await Post.find();
        res.json(posts.reverse()); // per i post in ordine cronologico
    } catch(err){
        res.json({ message: err });
    }

});


// get post specifico
router.get('/:postID', async (req, res) => {

    const post = await Post.findOne({postID: req.params.postID});
    if( ! post) res.status(404).send('ERROR: post [' + req.params.postID + '] not found');

    res.send(post);

});


// crea un nuovo post e aggiorna postsCreated dell'user che lo crea
router.post('/', verifyToken, async (req, res) => {

    const { error } = postValidation(req.body); // post validation -> joi
    if(error) res.status(400).send(error.details[0].message);

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET); // decoding jwt

    const user = await User.findOne({userID: decoded.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');

    // CREAZIONE NUOVO POST
    const post = new Post({

        publisher: user.nickname,
        activity: req.body.activity,
        title: req.body.title,
        details: req.body.details,
        place: req.body.place,
        maxPartecipants: req.body.maxPartecipants,
        dateOfEvent: req.body.dateOfEvent

    });

    const savedPost = await post.save();
    if( ! savedPost) res.status(500).send('ERROR: couldn\'t save the post');

    // aggiorna array user
    user.postsCreated.push(savedPost.postID);

    const savedUser = await user.save();
    if( ! savedUser) res.status(500).send('ERROR: couldn\'t update the user\'s post list');

    res.send('SUCCESS: user [' + savedUser.nickname + '] created post with id [' + savedPost.postID + ']');

});


// partecipa e aggiorna postsPartecipating dell'utente che partecipa
router.patch('/:postID/join', verifyToken, async (req, res) => {

    const post = await Post.findOne({postID: req.params.postID});
    if( ! post) res.status(404).send('ERROR: post [' + req.params.postID + '] not found');
 
    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

    const user = await User.findOne({userID: decoded.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');
 
    if(post.partecipants.includes(user.nickname)) return res.status(400).send('ERROR: user [' + user.nickname + '] already partecipating');
    if(post.partecipants.length >= post.maxPartecipants) return res.status(400).send('ERROR: post with id [' + post.postID +'] is full');
 
    // partecipa al post
    post.partecipants.push(user.nickname);

    const savedPost = await post.save();
    if( ! savedPost) res.status(500).send('ERROR: couldn\'t update the post');

    // aggiorna array user
    user.postsPartecipating.push(savedPost.postID);

    const savedUser = await user.save();
    if( ! savedUser) res.status(500).send('ERROR: couldn\'t update the user\'s post list');

    res.send('SUCCESS: user [' + savedUser.nickname + '] is now partecipating to post with id [' + savedPost.postID + ']');

});


// "departecipa" al post e aggiorna postsPartecipating dell'utente
router.patch('/:postID/leave', verifyToken, async (req, res) => {

    const post = await Post.findOne({postID: req.params.postID});
    if( ! post) res.status(404).send('ERROR: post [' + req.params.postID + '] not found');
 
    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

    const user = await User.findOne({userID: decoded.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');
 
    if( ! post.partecipants.includes(user.nickname)) return res.status(400).send('ERROR: user [' + user.nickname + '] is not partecipating');

    // departecipa al post
    removeA(post.partecipants, user.nickname);

    const savedPost = await post.save();
    if( ! savedPost) res.status(500).send('ERROR: couldn\'t update the post');

    // aggiorna array user
    removeA(user.postsPartecipating, savedPost.postID);

    const savedUser = await user.save();
    if( ! savedUser) res.status(500).send('ERROR: couldn\'t update the user\'s post list');

    res.send('SUCCESS: user [' + savedUser.nickname + '] leaved the post with id [' + savedPost.postID + ']');

});

// elimina post
router.delete('/:postID', verifyToken, async (req, res) => {

    const post = await Post.findOne({postID: req.params.postID});
    if( ! post) res.status(404).send('ERROR: post [' + req.params.postID + '] not found');

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);
    const maybeAdmin = await User.findOne({userID: decoded.userID});

    if(maybeAdmin.isAdmin){
        post.delete();
        res.send('SUCCESS: admin [' + maybeAdmin.nickname +'] deleted post with id [' + post.postID  + ']');
    } else if(decoded.nickname == post.publisher){
        post.delete();
        res.send('SUCCESS: user [' + decoded.nickname +'] deleted post with id [' + post.postID + ']');
    } else {
        res.status(401).send('ERROR: user [' + decoded.nickname + '] is not authorized to delete post with id [' + post.postID + ']');
    }    
    
});



// rimuove un elemento da un array tramite valore
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

module.exports = router;