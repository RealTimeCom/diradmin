/* TEST FILE - Copyright (c) 2017 diradmin - Tanase Laurentiu Iulian - https://github.com/RealTimeCom/diradmin */
'use strict';

const admin = require('./index.js'),
    net = require('net'), // or tls
    dirdb = require('dirdb'),
    sep = require('path').sep,
    fs = require('fs');

// client.js:
const src = 'src'; // source path directory
const opt = { // optional, admin config
    host: '*',
    src: src,
    cache: {
        '404.html': fs.readFileSync(src + sep + '404.html'),
        'index.html': fs.readFileSync(src + sep + 'index.html'),
        'favicon.ico': fs.readFileSync(src + sep + 'favicon.ico'),
        'admin.js': fs.readFileSync(src + sep + 'admin.js')
    }
};
function httpAdmin(obj) { // obj: db | db.client()
    net.createServer(socket => { // or tls
        socket.pipe(new admin(obj, opt)).pipe(socket);
    }).listen(80, function() {
        console.log('HTTP server start', this.address());
    });
}

// server.js:
const root = __dirname + sep + 'test';
fs.mkdirSync(root); // make a test directory

const db = new dirdb(root);

httpAdmin(db);

/* Stream
const client = db.client();
client.pipe(db.server()).pipe(client);
httpAdmin(client);
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
        httpAdmin(client);
    }).once('end', () => console.log('DB client disconnected'));
}).once('close', () => console.log('DB server close'));
*/
