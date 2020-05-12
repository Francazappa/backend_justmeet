const router = require('express').Router();

const jwt = require('jsonwebtoken');
const { postValidation } = require('../functions/validation');
const { dateTrimmer, timeTrimmer } = require('../functions/timeFunctions');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

const PostController = require('../controllers/postController');
const postController = new PostController();


// Definizione delle varie routes per i post


// get tutti i post
router.get('/', verifyToken, async (req, res) => {

    var result = await postController.getAllPosts();
    res.status(result[0]).json(result[1]);

});


// get post specifico
router.get('/:postID', verifyToken, async (req, res) => {

    var result = await postController.getPost(req.params.postID);
    res.status(result[0]).json(result[1]);

});


// crea un nuovo post e aggiorna postsCreated dell'user che lo crea
router.post('/', verifyToken, async (req, res) => {

    req.body.dateOfEvent = dateTrimmer(req.body.dateOfEvent); // formatta data
    req.body.timeOfEvent = timeTrimmer(req.body.timeOfEvent); // formatta ora

    const { error } = postValidation(req.body); // post validation -> joi
    if(error) return res.status(400).send(error.details[0].message);

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET); // decoding jwt

    var result = await postController.createNewPost(decoded, req.body);
    res.status(result[0]).send(result[1]);

});


// partecipa e aggiorna postsPartecipating dell'utente che partecipa
router.patch('/:postID/join', verifyToken, async (req, res) => {

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

    var result = await postController.joinPost(decoded, req.params.postID);
    res.status(result[0]).send(result[1]);

});


// abbandona il post e aggiorna postsPartecipating dell'utente
router.patch('/:postID/leave', verifyToken, async (req, res) => {
 
    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

    var result = await postController.leavePost(decoded, req.params.postID);
    res.status(result[0]).send(result[1]);

});


// elimina collezione post
router.delete('/', verifyToken, isAdmin, async (req, res) => {

    var result = await postController.deleteAllPosts();
    res.status(result[0]).send(result[1]);

});


// elimina post specifico
router.delete('/:postID', verifyToken, async (req, res) => {

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

    var result = await postController.deletePost(decoded, req.params.postID);
    res.status(result[0]).send(result[1]);
    
});


module.exports = router;