const express = require('express');
const app = express();

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});