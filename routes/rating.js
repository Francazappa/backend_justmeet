const router = require('express').Router();

const jwt = require('jsonwebtoken');

const verifyToken = require('../middlewares/verifyToken');
const { ratingValidation } = require('../functions/validation');

const RatingController = require('../controllers/RatingController');
const ratingController = new RatingController();


// req contiene: rating -> <0-10> -> int


// ottieni il rating di uno specifico utente
router.get('/:userID', verifyToken, async (req, res) => {
    
    var result = await ratingController.getRating(req.params.userID);
    res.status(result[0]).json(result[1]);
    
});


// vota un utente
router.post('/:userID', verifyToken, async (req, res) => {

    const { error } = ratingValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

    var result = await ratingController.rate(decoded, req.params.userID, req.body);
    res.status(result[0]).send(result[1]);

});


module.exports = router;