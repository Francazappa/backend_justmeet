// =========================================================================================================
/*
// sistema l'array dei post creati da un utente qual'ora i post non esistessero più
async function postsCreatedCleaner(user){
    
    const newArr = [];

    for(i = 0; i < user.postsCreated.length; i++){
        
        const post = await Post.find({postID: user.postsCreated[i]});
        if( post.length > 0) newArr.push(user.postsCreated[i]);

    }

    user.postsCreated = newArr;
    await user.save();

}


async function postsPartecipatingCleaner(user){
    
    const newArr = [];

    for(i = 0; i < user.postsPartecipating.length; i++){
        
        const post = await Post.find({postID: user.postsPartecipating[i]});
        if( post.length > 0) newArr.push(user.postsPartecipating[i]);

    }

    user.postsPartecipating = newArr;
    await user.save();

}
*/

// =========================================================================================================

/*
dateOfEvent: 2021-04-20T18:28:40.375+02:00
timeOfEvent: 2020-04-18T19:30:40.375+02:00
*/

/*
const reqDate = "2020-04-17T19:28:29.644+00:00";
const reqTime = "2020-04-18T19:30:40.375+02:00"

const year = reqDate.slice(0, 4);
const month = reqDate.slice(5, 7);
const day = reqDate.slice(8, 10);

const dateOfEvent = day + "-" + month + "-" + year

const timeOfEvent = reqTime.slice(11, 16);


console.log(dateOfEvent);
console.log(timeOfEvent);
*/


/*var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;*/

/*
const today = new Date();

const date = today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear();
const time = today.getHours() + ":" + today.getMinutes();

const dateTime = date + " " + time;

console.log(date);
console.log(time);
console.log(dateTime);
*/

/*
const today = new Date();
var time;
if(today.getMinutes < "10") { time = today.getHours() + ":0" + today.getMinutes();}
else { time = today.getHours() + ":" + today.getMinutes();} */

//(date.getMinutes()<10?'0':'') + date.getMinutes()

/*
const date = new Date();
const time = (date.getMinutes()<10?'0':'') + date.getMinutes();*/


/*
const today = new Date();

const hours = today.getHours();
const minutes = (today.getMinutes()<10?'0':'') + today.getMinutes();
const time = hours + ":" + minutes;


console.log(time);*/

/*const AAAAAAAAAAAAA = "2020-04-29T18:18:18.375+02:00";


function dateTrimmer(reqDate){

    const today = new Date();

    const year = reqDate.slice(0, 4);  console.log("year: " + year);
    const month = reqDate.slice(5, 7); console.log("month: " + month);
    const day = reqDate.slice(8, 10);  console.log("day: " + day);

    console.log("\n");

    //var dateOfEvent = day + "-" + month + "-" + year

    var dateOfEvent = new Date(year, month-1, day);

    console.log("dateOfEvent: " + dateOfEvent);
    console.log("today      : " + today);

    //if(dateOfEvent < today) console.log("minore");
    if(dateOfEvent <= today) console.log("NON OK");

    /*if(parseInt(year) < parseInt(today.getFullYear())) dateOfEvent = "error";
    if(parseInt(month) < 0 || parseInt(month) > 12) dateOfEvent = "error";
    if(parseInt(day) < 0 || parseInt(day) > 31) dateOfEvent = "error";*/

    /* appYear =  parseInt(year);  console.log("appYear: " + appYear); console.log("typeOf appYear: " + typeof(appYear)); console.log("\n");
    appMonth = parseInt(month); console.log("appMonth: " + appMonth); console.log("typeOf appMonth: " + typeof(appMonth));console.log("\n");
    appDay =  parseInt(day);  console.log("appDay: " + appDay); console.log("typeOf appDay: " + typeof(appDay)); console.log("\n"); */


    /* currentYear = today.getFullYear(); console.log("currentYear: " + currentYear); console.log("typeOf currentYear: " + typeof(currentYear)); console.log("\n");
    currentMonth = today.getMonth()+1; console.log("currentMonth: " + currentMonth); console.log("typeOf currentMonth: " + typeof(currentMonth)); console.log("\n");
    currentDay = today.getDay(); console.log("currentDay: " + currentDay); console.log("typeOf currentDay: " + typeof(currentDay)); console.log("\n"); */

    /*
    if(appYear < currentYear) dateOfEvent = "error";
    if(appMonth < currentMonth) dateOfEvent = "error";
    if(appDay < cu) dateOfEvent = "error";
    
    NO perché non potrei creare post tipo ad esempio tra un mese ma con giorno minore di oggi

    */


    //return dateOfEvent;

//}

function timeTrimmer(reqTime){

    const hours = reqTime.slice(11, 13);
    const minutes = reqTime.slice(14,16);

    var timeOfEvent = hours + ":" + minutes;

    if(hours < 0 || hours > 23) timeOfEvent = "error";
    if(minutes < 0 || minutes > 59) timeOfEvent = "error";

    return timeOfEvent;

}


const AAAAAAAAAAAAA = "2020-04-29T18:18:18.375+02:00";


function dateTrimmer(reqDate){

    const year = reqDate.slice(0, 4);
    const month = reqDate.slice(5, 7);
    const day = reqDate.slice(8, 10);

    var dateOfEvent = day + "-" + month + "-" + year

    const today = new Date();
    var appDateOfEvent = new Date(year, month-1, day);

    if(appDateOfEvent <= today) dateOfEvent = "error";
    
    return dateOfEvent;

    // controlla

}





const finalDate = dateTrimmer(AAAAAAAAAAAAA);

console.log(finalDate);