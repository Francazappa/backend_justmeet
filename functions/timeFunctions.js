// funzioni per manipolare data e ora


/* formatta la stringa della data

data: req.body.dateOfEvent -> ex: "2021-04-20T18:28:40.375+02:00"
formato accettato -> "17-04-2020" */
function dateTrimmer(reqDate){

    const year = reqDate.slice(0, 4);
    const month = reqDate.slice(5, 7);
    const day = reqDate.slice(8, 10);

    var dateOfEvent = day + "-" + month + "-" + year

    return dateOfEvent;

}


/* formatta la stringa della request contenente l'ora 

ora: req.body.timeOfEvent -> ex: "2020-04-18T19:30:40.375+02:00"
formato accettato -> "18:50" */
function timeTrimmer(reqTime){

    const hours = reqTime.slice(11, 13);
    const minutes = reqTime.slice(14,16);

    var timeOfEvent = hours + ":" + minutes;

    return timeOfEvent;

}


// ritorna una stringa con la data corrente
function getCurrentDate(){

    const today = new Date();
    const date = today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear();
    
    return date;

}


// ritorna una stringa con l'ora corrente
function getCurrentTime(){

    const today = new Date();

    const hours = today.getHours();
    const minutes = (today.getMinutes()<10?'0':'') + today.getMinutes();
    const time = hours + ":" + minutes;

    return time;

}


// esportazione delle funzioni
module.exports.dateTrimmer = dateTrimmer;
module.exports.timeTrimmer = timeTrimmer;
module.exports.getCurrentDate = getCurrentDate;
module.exports.getCurrentTime = getCurrentTime;