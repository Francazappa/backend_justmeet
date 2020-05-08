const User = require('../model/User');
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
    
        return [200, user];
    
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


module.exports = UserController;