const express = require("express");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();
const https = require("https");

const app = express();

// app.use(express.static(__dirname + '/public'));

app.use(express.static("public"));


//make the contact page the the first page on the app
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/views/index1.html");
});


const transporter = nodemailer.createTransport({
host: "smtp.gmail.com", //replace with your email provider
port: 587,
auth: {
user: process.env.EMAIL,
pass: process.env.PASSWORD,
},
tls: {
          rejectUnauthorized: false
      }
});

// verify connection configuration
transporter.verify(function (error, success) {
if (error) {
console.log(error);
} else {
console.log("Server is ready to take our messages");
}
});


app.post("/sendmail", (req, res) => {
  //1.
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });

    console.log(data.email);

    //2. You can configure the object however you want
    const mail = {
      from: data.firstname,
      to: process.env.EMAIL,
      email: data.email,
      text: `${data.firstname} <${data.email}> \n${data.message}`,
    };

    //3.
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Something went well.");

        // res.status(200).sendFile(process.cwd() + "/public/views/index1.html");
        // res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});




// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'bjaysmith9@gmail.com',
//     pass: 'Play_Book07'
//   },
//   tls: {
//              rejectUnauthorized: false
//       }
// });
//
// var mailOptions = {
//   from: 'bjaysmith9@gmail.com',
//   to: 'bjaysmith9@yahoo.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };
//
// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
















const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
