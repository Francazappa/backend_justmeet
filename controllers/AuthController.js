const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { getCurrentDate, getCurrentTime } = require('../functions/timeFunctions');
const bcrypt = require('bcryptjs');


class AuthController {

    constructor(){}


    async login(loginData){

        // CONTROLLO UTENTE GIA' REGISTRATO: controlla se l'username è nel db
        const user = await User.findOne({username: loginData.username});
        if( ! user) return [400, 'wrong username or password'];
    
        // CONTROLO PASSWORD: compara la pw nel body con quella cripatata nel db tramite bcrypt
        const validPass = await bcrypt.compare(loginData.password, user.password);
        if( ! validPass) return [400, 'wrong username or password'];
    
        // CREAZIONE E ASSEGNAZIONE JWT: se l'utente è in possesso del token può fare azioni -> private routes middlewares
        const token = jwt.sign({ userID: user.userID, username: user.username }, process.env.TOKEN_SECRET);
    
        return [200, token, user];
    
    }
    
    
    async register(registerData){
    
        // CONTROLLO USERNAME IN USO: controlla se c'è già un utente con quel username
        const usernameExists = await User.findOne({username: registerData.username});
        if(usernameExists) return [400, 'ERROR: username [' + registerData.username + '] already in use'];
    
        // CONTROLLO EMAIL IN USO: controlla se la email è già presente nel db
        const emailExists = await User.findOne({email: registerData.email});
        if(emailExists) return [400, 'ERROR: email [' + registerData.email + '] already in use'];
    
        // PASSWORD HASHING: tramite hash + salt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword  = await bcrypt.hash(registerData.password, salt); // hashing pw with salt
    
        const appRegisterDate = getCurrentDate();
        const appRegisterTime = getCurrentTime();
    
        // CREAZIONE NUOVO UTENTE:
        const user = new User({
    
            username: registerData.username,
            email: registerData.email,
            password: hashedPassword,
    
            registerDate: appRegisterDate,
            registerTime: appRegisterTime
    
        });
    
        try{
            const savedUser = await user.save();
            return [200, 'SUCCESS: user with id [' + savedUser.userID + '] created'];   
        }catch(err){
            return [500, "SERVER ERROR: couldn't save user " + err];
        }
    
    }

}


module.exports = AuthController;


// ==============================================================================================================================

// non implementata ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
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