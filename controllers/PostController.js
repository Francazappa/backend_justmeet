const Post = require('../model/Post'); // DB posts
const User = require('../model/User'); // DB utenti
const DeletedPost = require('../model/DeletedPost'); // DB post eliminati
const mongoose = require('mongoose');
const { getCurrentDate, getCurrentTime } = require('../functions/timeFunctions');
const { removeA } = require('../functions/commonFunctions');
const { sendEmail } = require('../functions/mailer');


class PostController {

    constructor(){}


    async getAllPosts(){

        try{
            const posts = await Post.find();
            return [200, posts.reverse()]; // per i post in ordine cronologico
        }catch(err){
            return [500, 'SERVER ERROR: couldn\'t get all posts'];
        }

    }


    async getPost(id){

        const post = await Post.findOne({postID: id});
        if( ! post) return [404, 'ERROR: post [' + id + '] not found'];
    
        return [200, post];

    }


    async createNewPost(decoded, postData){

        const user = await User.findOne({userID: decoded.userID});
        if( ! user) return [404, 'ERROR: user [' + decoded.userID + '] not found'];

        const appDateOfPublishing = getCurrentDate();
        const appTimeOfPublishing = getCurrentTime();

        // CREAZIONE NUOVO POST
        const post = new Post({

            publisher: user.username,

            activity: postData.activity,
            title: postData.title,
            details: postData.details,
            place: postData.place,
            maxPartecipants: postData.maxPartecipants,

            dateOfEvent: postData.dateOfEvent,
            timeOfEvent: postData.timeOfEvent,

            dateOfPublishing: appDateOfPublishing,
            timeOfPublishing: appTimeOfPublishing

        });

        const savedPost = await post.save();
        if( ! savedPost) return [500, 'SERVER ERROR: couldn\'t save the post'];
    
        // aggiorna array user
        user.postsCreated.push(savedPost.postID);
    
        const savedUser = await user.save();
        if( ! savedUser) return [500, 'SERVER ERROR: couldn\'t update the user\'s post list'];
    
        return [200, 'SUCCESS: user [' + savedUser.username + '] created post with id [' + savedPost.postID + ']'];

    }


    async joinPost(decoded, id){

        const post = await Post.findOne({postID: id});
        if( ! post) return [404, 'ERROR: post [' + id + '] not found'];

        const user = await User.findOne({userID: decoded.userID});
        if( ! user) return [404, 'ERROR: user [' + decoded.userID + '] not found'];
    
        if(post.partecipants.includes(user.username)) return [400, 'ERROR: user [' + user.username + '] already partecipating'];
        if(post.partecipants.length >= post.maxPartecipants) return [400, 'ERROR: post with id [' + post.postID +'] is full'];
    
        // partecipa al post
        post.partecipants.push(user.username);

        const savedPost = await post.save();
        if( ! savedPost) return [500, 'SERVER ERROR: couldn\'t update the post'];

        // aggiorna array user
        user.postsPartecipating.push(savedPost.postID);

        const savedUser = await user.save();
        if( ! savedUser) return [500, 'SERVER ERROR: couldn\'t update the user\'s post list'];

        // se l'evento è pieno manda la mail per notificare gli utenti iscritti
        if(post.partecipants.length == post.maxPartecipants) await sendEmail(post);

        return [200, 'SUCCESS: user [' + savedUser.username + '] is now partecipating to post with id [' + savedPost.postID + ']'];

    }


    async leavePost(decoded, id){

        const post = await Post.findOne({postID: id});
        if( ! post) return [404, 'ERROR: post [' + id + '] not found'];
    
        const user = await User.findOne({userID: decoded.userID});
        if( ! user) return [404, 'ERROR: user [' + decoded.userID + '] not found'];
     
        if( ! post.partecipants.includes(user.username)) return [400, 'ERROR: user [' + user.username + '] is not partecipating'];
    
        // departecipa al post
        removeA(post.partecipants, user.username);
    
        const savedPost = await post.save();
        if( ! savedPost) return [500, 'SERVER ERROR: couldn\'t update the post'];
    
        // aggiorna array user
        removeA(user.postsPartecipating, savedPost.postID);
    
        const savedUser = await user.save();
        if( ! savedUser) return [500, 'SERVER ERROR: couldn\'t update the user\'s post list']
    
        return [200, 'SUCCESS: user [' + savedUser.username + '] leaved the post with id [' + savedPost.postID + ']'];

    }


    async deleteAllPosts(){

        try{
            mongoose.connection.db.dropCollection('posts');
            console.log('post collection deleted');
            return [200, 'SUCCESS: posts collection deleted'];
        }catch(err){
            console.log('couldn\'t drop posts collection' + err);
            return [500, 'couldn\'t drop posts collection'];
        }

    }


    async deletePost(decoded, id){

        const post = await Post.findOne({postID: id});
        if( ! post) return [404, 'ERROR: post [' + id + '] not found'];
    
        const maybeAdmin = await User.findOne({userID: decoded.userID});
    
        if(maybeAdmin.isAdmin){
    
            try{

                moveToTrash(post);
                post.delete();
        
                return [200, 'SUCCESS: admin [' + maybeAdmin.username +'] deleted post with id [' + post.postID  + ']'];

            }catch(err){
                console.log("admin error while deleting specific post" + err);
            }
    
        } else if(maybeAdmin.username == post.publisher){
    
            try{

                moveToTrash(post);
                post.delete();
        
                return [200, 'SUCCESS: user [' + maybeAdmin.username +'] deleted post with id [' + post.postID  + ']'];

            }catch(err){
                console.log("user error while deleting specific post" + err);
            }
    
        } else {
            return [401, 'ERROR: user [' + maybeAdmin.username + '] is not authorized to delete post with id [' + post.postID + ']'];
        }

    }

}


async function moveToTrash(postToDelete){

    const appDateOfDeleting = getCurrentDate();
    const appTimeOfDeleting = getCurrentTime();
    
    const deleted = new DeletedPost({

        publisher: postToDelete.username,

        activity: postToDelete.activity,
        title: postToDelete.title,
        details: postToDelete.details,
        place: postToDelete.place,
        maxPartecipants: postToDelete.maxPartecipants,

        dateOfEvent: postToDelete.dateOfEvent,
        timeOfEvent: postToDelete.timeOfEvent,

        dateOfPublishing: postToDelete.dateOfPublishing,
        timeOfPublishing: postToDelete.timeOfPublishing,

        dateOfDeleting: appDateOfDeleting,
        timeOfDeleting: appTimeOfDeleting,

        deadPostID: postToDelete.postID

    });

    const deletedPost = await deleted.save();
    if( ! deletedPost) res.status(500).send("SERVER ERROR: couldn't move the post to delete in the trashbin");

}


module.exports = PostController;