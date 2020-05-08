const User = require('../model/User');
const { removeA } = require('../functions/commonFunctions');

class RatingController{

    constructor(){}

    
    async getRating(id){

        const user = await User.findOne({userID: id});
        if( ! user) return [404, 'ERROR: user [' + id + '] not found'];

        return [200, user.rating];

    }


    async rate(decoded, id, ratingData){

        // utente votante
        const votingUser = await User.findOne({userID: decoded.userID});
        if( ! votingUser) return [404, 'ERROR: votingUser with id[' + decoded.userID + '] not found'];
    
        // utente da votare
        const userToVote = await User.findOne({userID: id});
        if( ! userToVote) return [404, 'ERROR: userToVote with id[' + req.params.userID + '] not found'];
    
        // voto votingUser? (cioè voto me stesso?)
        if(votingUser.userID == userToVote.userID) return [400, 'ERROR: user [' + decoded.username + '] cannot vote himself ;)'];
    
        // votingUser ha già votato userToVote?
        for(var i = 0; i < userToVote.allRatings.length; i++){
    
        // se ho già votato un utente, elimino il mio precedente voto per darne uno nuovo
        if(userToVote.allRatings[i].votedBy == votingUser.userID) removeA(userToVote.allRatings, userToVote.allRatings[i]);
    
        }

        var votedBy = votingUser.userID;
        var vote = ratingData.rating;

        userToVote.allRatings.push({votedBy, vote});
        userToVote.rating = calculateAverageRating(userToVote.allRatings);

        try{
            const savedUser = await userToVote.save();
            return [200, 'SUCCESS: user [' + savedUser.username + '] has now an average rating of [' + savedUser.rating +']'];
        }catch(err){
            return [500, 'SERVER ERROR: couldn\'t update rating'];
        }

    }

}



function calculateAverageRating(arrCoppia){

    let app = []

    for(i = 0; i < arrCoppia.length; i++){

        app.push(arrCoppia[i].vote);
        
    }

    avg = app.reduce((a, b) => a + b, 0)/app.length;
    avg = avg.toFixed(1); // 1 numero dopo la virgola
    
    return avg;

}


module.exports = RatingController;