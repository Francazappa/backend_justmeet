const router = require('express').Router();

const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

const DeletedController = require('../controllers/DeletedController');
const deletedController = new DeletedController();


// "routes" per i post eliminati


// getta tutti i post eliminati
router.get('/', verifyToken, isAdmin, async (req, res) => {

    var result = await deletedController.getAllDeletedPosts();
    res.status(result[0]).json(result[1]);

});


// getta un post dal cestino!
router.get('/:delPostID', verifyToken, isAdmin, async (req, res) => {

    var result = await deletedController.getDeletedPost(req.params.delPostID);
    res.status(result[0]).json(result[1]);

});


// elimina collezione deletedposts
router.delete('/', verifyToken, isAdmin, async (req, res) => {

    var result = await deletedController.deleteAllDeletedPosts();
    res.status(result[0]).send(result[1]);

});


// elimina deletepost specifico -> lo elimina quindi definitivamente
router.delete('/:delPostID', verifyToken, isAdmin, async (req, res) => {

    // decoded lo metto nella req dal middleware isAdmin
    var result = await deletedController.deleteDeletedPost(req.decoded, req.params.delPostID);
    res.status(result[0]).json(result[1]);

});


module.exports = router;