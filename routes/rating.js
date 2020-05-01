const router = require('express').Router();
const User = require('../model/User');
const verifyToken = require('../middlewares/verifyToken');
const verifyRating = require('../middlewares/verifyRating');


// req contiene: rating -> <0-10> -> int


// ottieni il rating di uno specifico utente
router.get('/:userID', verifyToken, async (req, res) => {
    
    const user = await User.findOne({userID: req.params.userID});
    if( ! user) res.status(404).send('ERROR: user [' + req.params.userID + '] not found');
    
    res.send(user.rating);
    
});


// vota un utente
router.post('/:userID', verifyToken, verifyRating, async (req, res) => {

    /*
    a questo punto next() è stata hittata e posso votare.
    Inoltre ora req contiene:
        - req.votingUser
        - req.userToVote
    */

    const votingUser =  req.votingUser;
    const userToVote =  req.userToVote;

    const votedBy = votingUser.userID;
    const vote = req.body.rating; 

    // non effettuo controlli sull'input del voto perché ci pensa joi in validation.js
    userToVote.allRatings.push({votedBy, vote});
    userToVote.rating = calculateAverageRating(userToVote.allRatings);

    try{
        const savedUser = await userToVote.save();
        res.send('SUCCESS: user [' + savedUser.username + '] has now an average rating of [' + savedUser.rating +']');
    }catch(err){
        res.status(400).send(err);
    }

});

// =========================================================================================================================================


function calculateAverageRating(arrCoppia){

    let app = []

    for(i = 0; i < arrCoppia.length; i++){

        app.push(arrCoppia[i].vote);
        
    }

    avg = app.reduce((a, b) => a + b, 0)/app.length;
    avg = avg.toFixed(1); // 1 numero dopo la virgola
    
    return avg;

}


module.exports = router;