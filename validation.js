const Joi = require('@hapi/joi');

/*
Questo file contiene gli schemi per validare l'input dell'utente.
Se l'utente da in (input nei form) qualcosa di sbagliato o malevolo verrà restituito un errore.
*/

const emailCriteria = { minDomainSegments: 2, tlds: { allow: ['com', 'net', 'it'] } };

// register validation
// data è un parametro che gli passeremo, nel nostro caso il req.body in auth.js
const registerValidation = (data) => {

    const schema = Joi.object({
    
        nickname: Joi.string()
            .min(4)
            .max(24)
            .required(),
    
        email: Joi.string()
            .min(4)
            .max(128)
            .email(emailCriteria)
            .required(),
    
        password: Joi.string()
            .min(8)
            .max(128)
            .required(),
        
    });

    return schema.validate(data);

}


// login validation
const loginValidation = (data) => {

    const schema = Joi.object({
    
        email: Joi.string()
            .min(4)
            .email(emailCriteria)
            .required(),
    
        password: Joi.string()
            .min(4)
            .max(128)
            .required()
        
    });

    return schema.validate(data);

}


// post validation
const postValidation = (data) => {

    const schema = Joi.object({

        activity: Joi.string()
            .min(4)
            .max(128)
            .required(true),

        title: Joi.string()
            .min(4)
            .max(64)
            .required(true),
        
        details: Joi.string()
            .min(4)
            .max(2048),

        place: Joi.string()
            .min(4)
            .max(64)
            .required(true),
        
        maxPartecipants: Joi.number()
            .integer()
            .min(1)
            .max(64)
            .required(true),

        dateOfEvent: Joi.date() // formato -> mese-giorno-anno -> 02-21/2020
            .min('now')
            .required()

    });

    return schema.validate(data);

}

// rating validation
const ratingValidation = (data) => {

    const schema = Joi.object({
    
        rating: Joi.number()
            .integer()
            .min(0)
            .max(10)
            .required(true)
        
    });

    return schema.validate(data);

}

// esportazione delle funzioni
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;
module.exports.ratingValidation = ratingValidation;