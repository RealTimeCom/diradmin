/* SOURCE FILE - Copyright (c) 2017 diradmin - Tanase Laurentiu Iulian - https://github.com/RealTimeCom/diradmin */
'use strict';

const http = require('fast-stream'),
    path = require('path');

module.exports = function(db) {
    return {
        404: cb => cb('<html><body><h3>Hello World!</h3></body></html>', null, 200),
        GET: {
            '/': function(cb) {
                db.mkdir('auth', (e, d) => cb(e ? e.message : d));
            },
            '/test': cb => db.mkdir('auth2', (e, d) => cb(e ? e.message : d))
        }
    }
};
