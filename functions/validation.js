const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
/*
Questo file contiene gli schemi per validare l'input dell'utente.
Se l'utente da in (input nei form) qualcosa di sbagliato o malevolo verrà restituito un errore.
*/

const emailCriteria = { minDomainSegments: 2, tlds: { allow: ['com', 'net', 'it'] } };

// register validation.
// data è un parametro che gli passeremo, nel nostro caso il req.body in auth.js
const registerValidation = (data) => {

    const schema = Joi.object({
    
        username: Joi.string()
            .min(3)
            .max(24)
            .required()
            .messages(defaultStringError("il campo username")),
    
        email: Joi.string()
            .min(4)
            .max(128)
            .email(emailCriteria)
            .required()
            .messages(defaultStringError("il campo email"))
            .messages({"string.email":   "il campo email deve terminare con '.com, .net o .it'"}),
    
        password: Joi.string()
            .min(8)
            .max(128)
            .required()
            .messages(defaultStringError("il campo password"))
        
    });

    return schema.validate(data);

}


// login validation
const loginValidation = (data) => {

    const schema = Joi.object({
    
        username: Joi.string()
            .min(3)
            .max(24)
            .required()
            .messages(defaultStringError("il campo username")),
    
        password: Joi.string()
            .min(4)
            .max(128)
            .required()
            .messages(defaultStringError("il campo password"))
        
    });

    return schema.validate(data);

}


// post validation
const postValidation = (data) => {

    const schema = Joi.object({

        activity: Joi.string()
            .min(4)
            .max(128)
            .required()
            .messages(defaultStringError("il campo attivita'")),
            
        title: Joi.string()
            .min(4)
            .max(64)
            .messages(defaultStringError("il campo titolo")),
        
        details: Joi.string()
            .min(4)
            .max(2048)
            .messages(defaultStringError("il campo dettagli")),
            
        place: Joi.string()
            .min(4)
            .max(64)
            .required()
            .messages(defaultStringError("il campo luogo")),
        
        maxPartecipants: Joi.number()
            .integer()
            .min(1)
            .max(64)
            .required()
            .messages(defaultNumberError("il numero massimo dei partecipanti")),

        // formato dateOfEvent-> "giorno-mese-anno" -> ex: "17-04-2020"
        dateOfEvent: Joi.date()
            .format('DD-MM-YYYY')
            .min('now')
            .required()
            .messages({
                "date.min":     "non si possono creare post nel passato :)",
                "date.format":  "il campo data deve rispettare il formato 'giorno-mese-anno'",
                "any.required": "il campo data e' un campo richiesto"
            }),
        
        // formato dateOfEvent-> "ora:minuti" -> ex: "18:50"
        timeOfEvent: Joi.date()
            .format('HH:mm')
            .required()
            .messages({
                "date.format":  "il campo data deve rispettare il formato 'ore:minuti'",
                "any.required": "il campo data e' un campo richiesto"
            })

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
            .required()
            .messages(defaultNumberError("il campo rating"))
        
    });

    return schema.validate(data);

}


// ====================================================================================================


function defaultStringError(sampleText){

    var error = {

        "string.base":  sampleText + " deve essere una stringa di testo",
        "string.empty": sampleText + " non puo' essere vuoto",
        "string.min":   sampleText + " dovrebbe contenere almeno {#limit} caratteri",
        "string.max":   sampleText + " non puo' superare {#limit} caratteri",
        "any.required": sampleText + " e' un campo richiesto"

    }

    return error;

}


function defaultNumberError(sampleText){

    var error = {

        "number.integer":  sampleText + " deve essere un numero intero",
        "number.empty":    sampleText + " non puo' essere vuoto",
        "number.min":      sampleText + " non puo' essere minore di {#limit}",
        "number.max":      sampleText + " non puo' essere maggiore di {#limit}",
        "any.required":    sampleText + " e' un campo richiesto"

    }

    return error;

}


// esportazione delle funzioni
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;
module.exports.ratingValidation = ratingValidation;