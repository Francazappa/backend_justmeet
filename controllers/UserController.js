const User = require('../model/User');
const Post = require('../model/Post');
const mongoose = require('mongoose');

class UserController {

    constructor(){}
    

    async getAllUsers(){

        try{
            const users = await User.find();
            return [200, users];
        }catch{
            return [500, 'SERVER ERROR: couldn\'t get all users'];
        }
    
    }
    

    async getUser(id){
    
        const user = await User.findOne({userID: id});
        if( ! user) return [404, 'ERROR: user [' + id + '] not found'];

        try{
            await postsCleaner(user);
            return [200, user];
        }catch{
            return [500, 'SERVER ERROR: couldn\'t update postsCreated or postsPartecipating'];
        }

    }
    

    async deleteAllUsers(){
    
        try{
            mongoose.connection.db.dropCollection('users');
            console.log('SUCCESS: users collection deleted');
            return [200, 'SUCCESS: users collection deleted'];
        }catch(err){
            console.log('couldn\'t drop user collection ' + err);
            return [500, 'SERVER ERROR: couldn\'t drop user collection'];
        }
    
    }


    async deleteUser(decoded, id){
    
        const user = await User.findOne({userID: id});
        if( ! user) return [404, 'ERROR: user [' + req.params.userID + '] not found'];
    
        if(decoded.userID == id) return [404, 'ERROR: cannot delete current user [' + decoded.userID + ']'];
    
        try{
            user.delete();
            return [200, 'SUCCESS: admin [' + decoded.userID +'] deleted user with id [' + id + ']'];
        }catch{
            return [500, 'SERVER ERROR: couldn\'t delete user']
        }
    
    }

}


// =========================================================================================================================================


// aggiorna postsCreated e postsPartecipating di un utente con i post esistenti (rimuove quelli inesistenti)
async function postsCleaner(user){
    
    const newArr1 = [];
    const newArr2 = [];

    // creo newArr1 con i postsCreated che esistono
    for(i = 0; i < user.postsCreated.length; i++){
        
        const post = await Post.find({postID: user.postsCreated[i]});
        if( post.length > 0) newArr1.push(user.postsCreated[i]);

    }

    // creo newArr2 con i postsPartecipating che esistono
    for(i = 0; i < user.postsPartecipating.length; i++){
        
        const post = await Post.find({postID: user.postsPartecipating[i]});
        if( post.length > 0) newArr2.push(user.postsPartecipating[i]);

    }

    // aggiorno gli array dell'user
    user.postsCreated = newArr1;
    user.postsPartecipating = newArr2;

    try{
        await user.save();
    }catch(err){
        console.log("postsCleaner error");
    }

}


module.exports = UserController;