"use strict"
const express = require('express'),
      app     = express(),
      server = require('http').Server(app),
  	  io = require('socket.io')(server, {serveClient: true}); 

app.get('/chat.html', function (req, res) {
  console.log('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
// io.on('connection', function (socket) {
//     socket.emit('connected',"You are connected!");
//    });