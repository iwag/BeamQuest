var util = require('util'),
    Entity = require('beamQuest/model/entity');

/**
 * @constructor
 * @extends {model.Entity}
 */
var Player = function(opt_data) {
    Entity.apply(this, arguments);

    /** @type {number} */
    this.maxBp = this.data.maxBp || Player.DEFAULT_MAX_BP;

    /** @type {number} */
    this.bp = this.data.bp || this.maxBp;

    /** @type {Socket} */
    this.socket = this.data.socket || null;
};
util.inherits(Player, Entity);

Player.DEFAULT_MAX_BP = 10;

/** @override */
Player.prototype.toJSON = function() {
    var json = Player.super_.prototype.toJSON.apply(this);
    json.maxBp =  this.maxBp;
    json.bp = this.bp;
    return json;
};

module.exports = Player;