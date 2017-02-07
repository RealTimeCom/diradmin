/* SOURCE FILE - Copyright (c) 2017 diradmin - Tanase Laurentiu Iulian - https://github.com/RealTimeCom/diradmin */
'use strict';

const fs = require('fs'),
    sep = require('path').sep;

const s = __dirname + sep + 'src' + sep,
txt = { 'Content-Type': 'text/plain; charset=UTF-8' },
f = { // cache static files
    'index.html': fs.readFileSync(s + 'index.html'),
    '404.html': fs.readFileSync(s + '404.html'),
    'favicon.ico': fs.readFileSync(s + 'favicon.ico'),
    'admin.js': fs.readFileSync(s + 'admin.js'),
    'load.js': fs.readFileSync(s + 'load.js')
};

module.exports = function(db) {
    return { // http host conf object
        404: cb => cb(f['404.html'], null, 404),
        GET: {
            // static files:
            '/': cb => cb(f['index.html']),
            '/favicon.ico': cb => cb(f['favicon.ico'], { 'Content-Type': 'image/x-icon' }),
            '/admin.js': cb => cb(f['admin.js'], { 'Content-Type': 'text/javascript; charset=UTF-8' }),
            '/load.js': cb => cb(f['load.js'], { 'Content-Type': 'text/javascript; charset=UTF-8' }),
            // ajax, dynamic response:
            //'/test': cb => db.mkdir('auth', (e, d) => cb(e ? e.message : d))
            '/rootdir.txt': cb => cb(db.d, txt)
        }
    };
};
