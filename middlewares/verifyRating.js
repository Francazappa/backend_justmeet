const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { removeA } = require('../functions/commonFunctions');


/* questo middleware controlla se non mi voto da solo oppure 
cancella il voto precedente in caso si voglia votare di nuovo

req.body contiene: rating -> <0-10> -> int */ 


async function verifyRating(req, res, next){

  const decoded = jwt.decode(req.header('auth-token'), process.env.TOKEN_SECRET);

  // utente che vota -> lo cerco tramite username per il contenuto della request
  const votingUser = await User.findOne({userID: decoded.userID});
  if( ! votingUser) res.status(404).send('ERROR: votingUser with id[' + decoded.userID + '] not found');

  // utente da votare
  const userToVote = await User.findOne({userID: req.params.userID});
  if( ! userToVote) res.status(404).send('ERROR: userToVote with id[' + req.params.userID + '] not found');

  // voto votingUser? (cioè voto me stesso?)
  if(votingUser.userID == userToVote.userID) return res.status(400).send('ERROR: user [' + decoded.username + '] cannot vote himself ;)');

  // votingUser ha già votato userToVote?
  for(i = 0; i < userToVote.allRatings.length; i++){

    // se ho già votato un utente, elimino il mio precedente voto per darne uno nuovo
    if(userToVote.allRatings[i].votedBy == votingUser.userID) removeA(userToVote.allRatings, userToVote.allRatings[i]);

  }

  // aggiungo votingUser e userToVote alla req per evitare operazioni inutili di db
  req.votingUser = votingUser;
  req.userToVote = userToVote;

  // se hitto next() significa che posso votare userToVote
  next();

}


module.exports = verifyRating;