/* SOURCE FILE - Copyright (c) 2017 diradmin - Tanase Laurentiu Iulian - https://github.com/RealTimeCom/diradmin */
'use strict';

const http = require('fast-stream'),
    path = require('path');

function conf(opt) {
    console.log('opt', typeof opt);
    const s = 'src' in opt ? opt.src + '' : 'src',
        r = {},
        h = {
            404: cb => cb(opt.cache && '404.html' in opt.cache ? opt.cache['404.html'] : { src: s + path.sep + '404.html' }, null, 404),
            GET: {
                '/': cb => cb(opt.cache && 'index.html' in opt.cache ? opt.cache['index.html'] : { src: s + path.sep + 'index.html' }),
                '/favicon.ico': cb => cb(opt.cache && 'favicon.ico' in opt.cache ? opt.cache['favicon.ico'] : { src: s + path.sep + 'favicon.ico' }, { 'Content-Type': http.type['ico'] }),
                '/admin.js': cb => cb(opt.cache && 'favicon.ico' in opt.cache ? opt.cache['admin.js'] : { src: s + path.sep + 'admin.js' }, { 'Content-Type': http.type['js'] }),
            }
        };
    r['host' in opt ? opt.host + '' : '*'] = h;
    return r;
}

class admin extends http {
    constructor(db, opt) {
        if (typeof db !== 'object') { throw new Error('invalid database type'); }
        if (!(typeof db.mkdir === 'function' && typeof db.put === 'function')) { throw new Error('invalid database object'); }
        if (typeof opt !== 'object') { opt = {}; }
        super(conf(opt), opt);
        this.db = db;
    }
}

module.exports = admin;
