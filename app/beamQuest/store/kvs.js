/**
 * @fileoverview オンメモリのKVS的なやつ。redisに置き換える？
 */
var redis = require('redis'),
    CONFIG = require('config').kvs;

var SessionStore = {
    session_: {},
    isEnd: false,
    get: function (key, callback) {
        if (this.isEnd) {
            callback('connection already closed', null);
        }
        if (key in this.session_) {
            callback(null, this.session_[key]);
        }
        else {
            callback(null, null);
        }
    },
    set: function (key, value) {
        this.session_[key] = value;
    },
    del: function (key) {
        delete this.session_[key];
    },
    flushall: function(callback) {
        if (this.isEnd) {
            callback(false);
        }
        this.session_ = {};
        logger.info('kvs flushall');
        callback(true);
    },
    end: function() {
        this.isEnd = true;
    }
};

exports.createClient = function() {
    logger.info('kvs type: ' + CONFIG.type);
    if (CONFIG.type === 'memory') {
        return SessionStore;
    } else if (CONFIG.type === 'redis') {
        var client = redis.createClient(CONFIG.port, CONFIG.host);
        client.auth(CONFIG.pass);
        return client;
    }
};
