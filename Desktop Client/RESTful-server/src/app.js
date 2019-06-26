const express = require('express'),
  http = require('http')
const path = require('path')
const fs = require('fs')
const ndjson = require('ndjson')
const things = require('./categories');

const app = express();
const server = http.createServer(app)
const io = require('socket.io').listen(server);

// Project directories
const publicDirPath = path.join(__dirname, '../public')

// middleware to access io in express routers
// thus, accessing express routes can act as triggers for currently held sockets
app.use(function(req,res,next){
  req.io = io;
  next();
})

app.set('port', 3000, (process.env.PORT || 5000));

// Serves up static content from public directory
// Recall: index.html is the default landing page (i.e. '/' directory)
app.use(express.static(publicDirPath))

// Hold array of all different variations of item drawings (read from file)
let drawings = [];

// Endpoint that triggers frontend of server to draw the specified thing
// In turn calls /getByName endpoint via loadJSON function
app.get('/senddata/*', (req,res) => {
  const item = req.path.replace('/senddata/','').toLowerCase();
  console.log("Trying to draw: " + item);
  if (things.includes(item)) {
    // draw item to server screen
    // use socket.io to send name and index of item to draw to the frontend (sktech.js file)
    req.io.emit('serverToDisplay', {item, id: req.query.id})
    res.status(200).send("No data for you.")
  } else {
    res.status(400).send("Unable to draw unknown item.");
  }
})


// Use wildcard endpoint to get any item from database.
// Send back vertice data back for frontend to draw if item is in database, otherwise send error.
app.get('/*', (req,res) => {
  var id = req.query.id;
  const item = req.path.replace('/','').toLowerCase();
  if (things.includes(item)) {
    const fp = __dirname + '/../public/processing/data/' + item + '.ndjson';
    fs.createReadStream(fp)
      .pipe(ndjson.parse())
      .on('data', function(obj) {
        drawings.push(obj)
      })
      .on('end', function() {
        if (!id) {
          var rIndex1 = Math.floor(Math.random() * drawings.length);
          var rIndex2 = Math.floor(Math.random() * drawings.length);
          var rIndex3 = Math.floor(Math.random() * drawings.length);

          while (!drawings[rIndex1].recognized) {
            rIndex1 = Math.floor(Math.random() * drawings.length);
          }
          while (!drawings[rIndex2].recognized) {
            rIndex2 = Math.floor(Math.random() * drawings.length);
          }
          while (!drawings[rIndex3].recognized) {
            rIndex3 = Math.floor(Math.random() * drawings.length);
          }

          res.send({
            drawingOne: drawings[rIndex1],
            drawingTwo: drawings[rIndex2],
            drawingThree: drawings[rIndex3],
            indices: [rIndex1, rIndex2, rIndex3]
          });
        } else {
          res.send(drawings[id]);
        }
        drawings = [];
      })
  } else {
    res.status(404).send("Error: cannot find item in database.");
  }
})

server.listen(app.get('port'), () => {
  console.log('Server is up on port ' + 3000);
});
