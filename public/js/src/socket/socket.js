/**
 * @fileoverview socket.ioの初期設定をする
 */

var Socket = cc.Class.extend({
    ctor: function() {
        this.socket = io.connect();
        this.init();
    },

    init: function() {
        this.socket.on('connected', function (data) {

        });
    },

    /**
     * ログインを試みる。レスポンスが返ってきたらcallbackを実行する
     * @param {string} userId
     * @param {string} hash
     * @param {Function} callback
     * @param {Object} selfObj
     */
    tryLogin: function(userId, hash, callback, selfObj) {
        this.socket.emit('login', {userId: userId, hash: hash});
        this.socket.once('login:receive', $.proxy(callback, selfObj));
    }
});

Socket.instance_ = new Socket();

Socket.getInstance = function() {
    return Socket.instance_;
};
