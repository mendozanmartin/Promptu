const express = require('express');
const app = express();
const fs = require('fs');
const speech = require('@google-cloud/speech');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const dialogflowKey = require('./speechtodrawhack-e390f60816fa.json')
const speechClient = new speech.SpeechClient();

var alternative = "";
// Creates a client

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const filename = './My favourite animal is a dog.wav';
const encoding = 'MP3';
const sampleRateHertz = 48000;
const languageCode = 'en-US';

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
  audioChannelCount: 2
};
const audio = {
  content: fs.readFileSync(filename).toString('base64'),
};

const request = {
  config: config,
  audio: audio,
};

async function speechToText() {

const [response] = await speechClient.recognize(request);

response.results.forEach(element => {

  alternative = element.alternatives;
});

var transcript = JSON.parse(JSON.stringify(alternative));
console.log(transcript[0].transcript)
getAnimal(transcript[0].transcript).catch(console.error);
}
speechToText().catch(console.error)


////////////////////////////////////////////////////////////////////////////
async function getAnimal(text) {
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
    console.log(`  Intent: ${result.intent.displayName}`);
    console.log("  Animal: " + result.parameters.fields.animal.stringValue);
  } else {
    console.log(`  No intent matched.`);
  }
}


