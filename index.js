
const express = require('express'); 
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const twilio = require('twilio');   
var http = require('http');
var AuthController = require('./api/AuthController');
var patientRouter= require('./api/PatientService');
var drugs= require('./api/drugs');

//twilio requirements -- Texting API 
const accountSid = 'ACc37183f289c7ca9f2b2a6362f70c180e';
const authToken = '7dc390692e2d7d023c3ecd8bbbb46ca2'; 
const client = new twilio(accountSid, authToken);
  
const app = express(); //alias
var Port = process.env.PORT || 4000 //alias

app.use(cors()); //Blocks browser from restricting any data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/auth', AuthController);
app.use('/Patient',patientRouter);
app.use('/drugs',drugs);
//Welcome Page for the Server 
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server')
})

//Twilio 
app.get('/send-text', (req, res) => {
    //Welcome Message
    res.send('Hello to the Twilio Server')

    //_GET Variables
    const { recipient, textmessage } = req.query;


    //Send Text
    client.messages.create({
        body: textmessage,
        to: '+216'+recipient,  // Text this number
        from: '+19715992958' // From a valid Twilio number
    }).then((message) => console.log(message.body));
})

var server = http.Server(app);
server.listen(Port, function() {
    console.log(' server running');
  });