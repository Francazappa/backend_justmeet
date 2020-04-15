const User = require('../model/User');
const Post = require('../model/Post');
const jwt = require('jsonwebtoken');

// devo solamente controllare se l'utente possa votare o meno. Il voto non lo assegno da qui

/* 
devo partecipare al post postID
devo vedere se chi voglio votare partecipa al post postID

SE NON L'HO VOTATO -> next() altrimenti RIP


req contiene: userToVote -> id -> int
                  postID -> id -> int
                ----------------------
                  rating -> int

*/

function verifyRating(req, res, next){

    const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

    // io
    const votingUser = await User.findOne({userID: decoded.userID});
    if( ! votingUser) res.status(404).send('errore 1 votingUser not found');

    // chi voglio votare
    const userToVote = await User.findOne({userID: req.userToVote});
    if( ! userToVote) res.status(404).send('errore 2 userToVote not found');

    // il post in comune tra votingUser e userToVote
    const commonPost = await User.findOne({postID: req.postID});
    if( ! commonPost) res.status(404).send('errore 3 post not found');

    // gli utenti partecipano allo stesso post?
    if( ! (commonPost.partecipants.find(votingUser.userID)) && (commonPost.partecipants.find(userToVote.userID))){
        res.status(400).send('errore 4 gli utenti non partecipano allo stesso post');
    }

    // votingUser ha già votato userToVote in commonPost?





    next();

}


module.exports = verifyRating;