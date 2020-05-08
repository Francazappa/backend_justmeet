var nodemailer = require('nodemailer');
const User = require('../model/User');
require('dotenv').config();

// nodemailer per inviare email di notifica ->  da implementare quando qualcuno fa la patch su un post specifico

const transporter = nodemailer.createTransport({

  service: 'gmail',
  auth: {
    user: process.env.JUSTMEETEMAIL,
    pass: process.env.JUSTMEETPASSW
  }

});


async function sendEmail(post){

    const mailingList = await mailingListBuilder(post);
    const emailBody = textBuilder(post);

    const mailOptions = {

        from: process.env.JUSTMEETEMAIL,
        to: mailingList,
        subject: "attività " + post.activity,
        text: emailBody

      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log('email not sent ' + error);
        } else {
          console.log('SUCCESS: email sent ' + info.response);
        }
      });

}


// =========================================================================================================================================


async function mailingListBuilder(post){

    var mailingList = "";

    for(i = 0; i < post.partecipants.length; i++){

        try{
            const user = await User.findOne({username: post.partecipants[i]});
            mailingList = mailingList + user.email + ", ";
        }catch{
            console.log("mailingListBuilder error: cannot find user from db");
        }

    }

    return mailingList;

}


function textBuilder(post){

    return "L' evento " + post.title + " è pieno!" + "\n" +
           "Non dimenticarti di recarti a " + post.place + " il " + post.dateOfEvent + " alle " + post.timeOfEvent + "." + "\n" + 
           "Buon divertimento!! :)" + "\n\n\n" + 
           "- servizio noReply di JustMeet -"

}


module.exports.sendEmail = sendEmail;