const router = require('express').Router();
const DeletedPost = require('../model/DeletedPost'); // DB post eliminati
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// "routes" per i post eliminati


// tutti i post eliminati
router.get('/', verifyToken, isAdmin, async (req, res) => {

    try{
        const deleted = await DeletedPost.find();
        res.json(deleted);
    } catch(err){
        res.json({ message: err });
    }

});


// getta un post dal cestino!
router.get('/:delPostID', verifyToken, isAdmin, async (req, res) => {

    const deleted = await DeletedPost.findOne({deletedPostID: req.params.delPostID});
    if( ! deleted) res.status(404).send('ERROR: deleted post [' + req.params.delPostID + '] not found');

    res.json(deleted);

});


// elimina deletepost specifico -> lo elimina quindi definitivamente
router.delete('/:delPostID', verifyToken, isAdmin, async (req, res) => {

    const deleted = await DeletedPost.findOne({deletedPostID: req.params.delPostID});
    if( ! deleted) res.status(404).send('ERROR: deleted post [' + req.params.delPostID + '] not found');

    res.send('SUCCESS: admin [' + req.decoded.username +'] deleted deletedPost with id [' + deleted.deletedPostID + ']');

});


// elimina collezione deletedposts
router.delete('/', verifyToken, isAdmin, async (req, res) => {

    try{
        mongoose.connection.db.dropCollection('deletedposts', () => {

            console.log("SUCCESS: admin [" + req.decoded.username + "] DELETED deletposts collection");
            res.send("SUCCESS: admin [" + req.decoded.username + "] DELETED deletposts collection");
    
        });
    }catch(err){
        console.log("error while dropping deleted posts collection" + err);
    }

});



module.exports = router;