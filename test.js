/* TEST FILE - Copyright (c) 2017 diradmin - Tanase Laurentiu Iulian - https://github.com/RealTimeCom/diradmin */
'use strict';

// rm -rf test | authbind node test.js

const admin = require('./index.js'),
    net = require('net'), // or tls
    dirdb = require('dirdb'),
    http = require('fast-stream'),
    fs = require('fs');

// server.js:
const root = __dirname + require('path').sep + 'test'; // test directory
try { fs.mkdirSync(root); } catch (e) {} // make

const sock = '.db.server.sock';
try { fs.unlinkSync(sock); } catch (e) {}

const db = new dirdb(root);

function config(client) {
    return {
        '*': admin(client)
    };
}
/*
// const cf = config(db);
net.createServer(socket => { // create HTTP server, listen PORT 80 or 443 ( if tls )

    const client = db.client();
    client.pipe(db.server()).pipe(client); // dummy stream test

    socket.
    on('error', e => console.log('error', e)).
    pipe(new http(config(client))). // config(client)) if is stream, or cf for db core ( delete client pipe )
    pipe(socket);

}).listen(80, function() {
    console.log('HTTP server start', this.address());
});
*/

// create DB .sock server, or change to IP:PORT
net.createServer(socket => socket.pipe(db.server()).pipe(socket)). // net or tls
listen(sock, function() {
    console.log('DB server start', this.address());
    startAdmin();
});

// client.js
function startAdmin(client) {
    net.createServer(socket => { // net or tls, create HTTP server, listen PORT 80 or 443 ( if tls )

        net.connect(sock, function() { // net or tls, client connect to DB .sock server, or change to IP:PORT

            console.log('DB client connected');
            const client = db.client();
            this.pipe(client).pipe(this);

            socket.
            on('error', e => console.log('error', e)).
            pipe(new http(config(client))).
            pipe(socket);

        }).once('end', () => console.log('DB client disconnected'));

    }).listen(80, function() {
        console.log('HTTP server start', this.address());
    });
}
