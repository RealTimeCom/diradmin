/* TEST FILE - Copyright (c) 2017 diradmin - Tanase Laurentiu Iulian - https://github.com/RealTimeCom/diradmin */
'use strict';

// rm -rf test | authbind node test.js

const admin = require('./index.js'),
    net = require('net'), // or tls
    dirdb = require('dirdb'),
    http = require('fast-stream');

// server.js:
const root = __dirname + require('path').sep + 'test'; // test directory
try { require('fs').mkdirSync(root); } catch (e) { } // make

const db = new dirdb(root);

const client = db.client();
client.pipe(db.server()).pipe(client);

// client.js
const config = {
    '*': admin(db)
};

net.createServer(socket => {
    socket.pipe(new http(config)).pipe(socket); // , { ranges: false }
}).listen(80);

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
