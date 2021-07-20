const express = require('express');
//LINE CONFIG
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: '8N1ebxPBtOX5PUotIj/GqRPVeTM7fxs8oPv/CCQ0Z2aniAv4gNLGSbVG9U6MswE0TFI0IPAVppEksIOrzjUZR+SoM9l7Z/han/4rx02shDPqb3LPfatScCRQ0ha9ViXf1K42ifhGiDmkNFDmnklbewdB04t89/1O/w1cDnyilFU=',
    channelSecret: '2320a8cba3ca02fe0fd05caa414ed0a8'
};
const client = new line.Client(config);

//FIREBASE
const firebase = require('firebase');
require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyBtHRICd8FEWo1endXYuFwfiUWfbND2h3s",
    authDomain: "lineoa-964eb.firebaseapp.com",
    projectId: "lineoa-964eb",
    storageBucket: "lineoa-964eb.appspot.com",
    messagingSenderId: "275475550193",
    appId: "1:275475550193:web:a6f70e010ae9e6f7b2fe50",
    measurementId: "G-SM1NV98TPV"
} 
const admin = firebase.initializeApp(firebaseConfig);
const db = admin.firestore();
//WEB

const app = express();
const port = 3000

app.post('/webhook', line.middleware(config), (req, res) => {
    //console.log(req);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    // SAVE TO FIREBASE
    let chat = await db.collection('chats').add(event);
    console.log('Added document with ID: ', chat.id);

    //console.log(event);
    //console.log(event.message);
    //console.log(event.message.text);
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text,
    });  
}

// Respond with Hello World! on the homepage:
app.get('/', function (req, res) {
    res.send('Hello World!5555555555555555555555555555')
})

// Respond to POST request on the root route (/), the application’s home page:
app.post('/', function (req, res) {
    res.send('Got a POST request')
})
// Respond to a PUT request to the /user route:
app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
})
// Respond to a DELETE request to the /user route:
app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
})

app.get('/test-firebase', async function (req, res) {
    let data = {
        name: 'Bangkok',
        country: 'Thailande'
    }
    const result = await db.collection('cities').add(data);
    console.log('Added document with ID: ', result.id);
    res.send('Test firebase successfully, check your firestore for a new record !!!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



