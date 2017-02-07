/* SOURCE FILE - Copyright (c) 2017 diradmin - Tanase Laurentiu Iulian - https://github.com/RealTimeCom/diradmin */
'use strict';

const fs = require('fs'),
    sep = require('path').sep;

const s = __dirname + sep + 'src' + sep,
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
            '/rootdir': cb => cb(db.d),
            '/list': cb => db.list(r => cb(JSON.stringify({ r: r }))),
            '/mkdir': (cb, req) => {
                if (req.query.dir) {
                    db.mkdir(req.query.dir, e => {
                        if (e) {
                            cb(JSON.stringify({ e: e.message }));
                        } else {
                            db.list(r => cb(JSON.stringify({ r: r })));
                        }
                    });
                } else {
                    cb(JSON.stringify({ e: 'dirname not found' }));
                }
            },
            '/rmdir': (cb, req) => {
                if (req.query.dir) {
                    db.rmdir(req.query.dir, e => {
                        if (e) { cb(JSON.stringify({ e: e.message })); } else {
                            db.list(r => cb(JSON.stringify({ r: r })));
                        }
                    });
                } else {
                    cb(JSON.stringify({ e: 'dirname not found' }));
                }
            },
            '/keys': (cb, req) => {
                if (req.query.dir) {
                    db.keys(req.query.dir, (e, k) => {
                        if (e) { cb(JSON.stringify({ e: e.message })); } else {
                            cb(JSON.stringify({ d: req.query.dir, k: k }));
                        }
                    });
                } else {
                    cb(JSON.stringify({ e: 'dirname not found' }));
                }
            },
            '/put': (cb, req) => {
                if (req.query.dir && req.query.key && req.query.val) {
                    db.put(req.query.dir, req.query.key, req.query.val, e => {
                        if (e) { cb(JSON.stringify({ e: e.message })); } else {
                            cb(JSON.stringify({ d: req.query.dir }));
                        }
                    });
                } else {
                    cb(JSON.stringify({ e: 'invalid query' }));
                }
            },
            '/val': (cb, req) => {
                if (req.query.dir && req.query.uid && req.query.hash) {
                    db.val(req.query.dir, req.query.uid, req.query.hash, (e, k, v) => {
                        if (e) { cb(JSON.stringify({ e: e.message })); } else {
                            cb(JSON.stringify({ d: req.query.dir, uid: req.query.uid, k: k.toString(), v: v.toString() }));
                        }
                    });
                } else {
                    cb(JSON.stringify({ e: 'invalid query' }));
                }
            }
        }
    };
};
