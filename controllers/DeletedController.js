const DeletedPost = require('../model/DeletedPost'); // DB post eliminati
const mongoose = require('mongoose');


class DeletedController {

    constructor(){}


    async getAllDeletedPosts(){

        try{
            const deleted = await DeletedPost.find();
            return [200, deleted];
        } catch(err){
            return [500, 'couldn\'t get all deleted posts'];
        }

    }


    async getDeletedPost(id){

        const deleted = await DeletedPost.findOne({deletedPostID: id});
        if( ! deleted) return[404, 'ERROR: deleted post [' + id + '] not found'];
    
        return [200, deleted];

    }


    async deleteAllDeletedPosts(){

        try{
            mongoose.connection.db.dropCollection('deletedposts');
            console.log('deleted deletedposts collection');
            return [200, 'SUCCESS: deletedposts collection deleted'];
        }catch(err){
            console.log('couldn\'t drop deletedposts collection ' + err);
            return [500, 'SERVER ERROR: couldn\'t drop deletedposts collection'];
        }

    }


    // crea confusione il nome deletedpost secondo voi? secondo me si
    async deleteDeletedPost(decoded, id){

        const deleted = await DeletedPost.findOne({deletedPostID: id});
        if( ! deleted) return [404, 'ERROR: deleted post [' + id + '] not found'];

        try{
            deleted.delete();
            return [200, 'SUCCESS: admin [' + decoded.username +'] deleted deletedPost with id [' + deleted.deletedPostID + ']'];
        }catch{
            return [500, 'SERVER ERROR: couldn\'t delete deletedPost']
        }

    }

}


module.exports = DeletedController;