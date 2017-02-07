/* TEST FILE - Copyright (c) 2017 diradmin - Tanase Laurentiu Iulian - https://github.com/RealTimeCom/diradmin */
'use strict';

// rm -rf test | authbind node test.js

const admin = require('./index.js'),
    net = require('net'), // or tls
    dirdb = require('dirdb'),
    http = require('fast-stream'),
    sep = require('path').sep,
    fs = require('fs');

// server.js:
const root = __dirname + sep + 'test';
fs.mkdirSync(root); // make a test directory

const db = new dirdb(root);

// client.js
const config = {
    '*': admin(db)
};

require('net').createServer(
    socket => socket.pipe(new http(config)).pipe(socket)
).listen(80);

/* Stream
const client = db.client();
client.pipe(db.server()).pipe(client);
//admin(client);
*/
/* Socket Stream
const server = db.server();
const client = db.client();
net.createServer(socket => { // or tls
    socket.pipe(server).pipe(socket);
}).listen('dirdb.sock', function() { // socket file | port
    const a = this.address();
    console.log('DB server start', a);
    // client.js:
    net.connect(a.port, a.address, function() { // or tls
        this.pipe(client).pipe(this);
        console.log('DB client start');
        //admin(client);
    }).once('end', () => console.log('DB client disconnected'));
}).once('close', () => console.log('DB server close'));
*/
