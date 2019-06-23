var express = require('express')
    , http = require('http');
//make sure you keep this order
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var httpRequest = require('request')
var drawing = [];
var name = ""
var indices = [];
var animal = "";

//var serveStatic = require('serve-static');


const fs = require('fs');
const speech = require('@google-cloud/speech');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const speechClient = new speech.SpeechClient();

app.set('port', (process.env.PORT || 5000));

//app.use(serveStatic(__dirname + "/public"));

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('sendVideo', (data) => {
        speechToText(data.blob, (result, drawingArray, animal) => {
            console.log(result.queryText)
            console.log(drawingArray)
            socket.emit('result', {
                transcription: result.queryText,
                drawing: drawingArray,
                animal: animal
            })
        }).catch(console.error)
    });

    socket.on('sendDrawing', (data) => {
        var numToSend;
        console.log(data.number)
        if (data.number == 0) {
            console.log(indices[0])
            numToSend = indices[0]
        } else if (data.number == 1) {
            numToSend = indices[1]
            console.log(indices[1])

        } else {
            numToSend = indices[2]
            console.log(indices[2])

        }
        const url = `https://89c73e13.ngrok.io/senddata/${name.replace(/ /g, "_")}?id=${numToSend}`
        httpRequest({ url, json: true }, (error, { body }) => {
            console.log(body)
        })
    })
    //end of socket connection
});


app.use(express.static(__dirname + '/public'));

server.listen(app.get('port'), function () {
    console.log('listening on *:5000');
});


var alternative = "";
// Creates a client

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
//const filename = './My favourite animal is a dog.wav';



async function speechToText(blob, callback) {
    drawing = [];
    name = ""
    indices = [];
    animal = "";
    

    const encoding = 'MP3';
    // const sampleRateHertz = 48000;
    const languageCode = 'en-US';
    const filename = blob;

    const config = {
        encoding: encoding,
        //   sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        audioChannelCount: 2
    };
    const audio = {
        content: filename,
    };

    const request = {
        config: config,
        audio: audio,
    };
    const [response] = await speechClient.recognize(request);

    response.results.forEach(element => {

        alternative = element.alternatives;
    });

    var transcript = JSON.parse(JSON.stringify(alternative));
    console.log(transcript[0].transcript)
    getAnimal(transcript[0].transcript, callback).catch(console.error);
}


////////////////////////////////////////////////////////////////////////////
async function getAnimal(text, callback) {
    // A unique identifier for the given session
    const sessionId = uuid.v4();
    var projectId = 'speechtodrawhack'

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: text,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');

    const result = responses[0].queryResult;

    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        animal = result.parameters.fields.animal.stringValue;
        const url = `https://89c73e13.ngrok.io/${result.parameters.fields.animal.stringValue.replace(/ /g, "_")}`;
        httpRequest({ url, json: true }, (error, { body }) => {
            try {
                console.log(body)
                name = body.drawingOne.word;
                indices = [body.indices[0], body.indices[1], body.indices[2]]
                drawing = [body.drawingOne.drawing, body.drawingTwo.drawing, body.drawingThree.drawing]
                callback(result, drawing, animal);
            } catch(err) {

            }
       
        })

        try {
            console.log("  Animal: " + result.parameters.fields.animal.stringValue);

        } catch (err) {

        }
    } else {
        console.log(`  No intent matched.`);
    }

}
