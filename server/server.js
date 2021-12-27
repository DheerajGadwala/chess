const app = require('express')();
const http = require('http').Server(app);

app.get('/', function(req, res) {
   console.log("yolo");
});

http.listen(5000, function() {
   console.log('listening on *:5000');
});