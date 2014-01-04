var mapStore = require('beamQuest/store/maps'),
    entityListener = require('beamQuest/listener/entity');

/**
 * ゲーム内のEntityの状態を保持しておくクラス
 * @constructor
 */
var Entities = function() {
    /**
     * マップごとのプレイヤー一覧
     * @typedef {
     *    mapId: {
     *       userId: model.Player
     *    }
     * }
     * @private
     */
    this.mapPlayers_ = {};

    /**
     * マップごとのmob一覧
     * @type {Object}
     * @private
     */
    this.mapMobs_ = {};

    /**
     * マップごとのnpc一覧
     * @type {Object}
     * @private
     */
    this.mapNpcs_ = {};

    this.init_();
};

/**
 * @private
 */
Entities.prototype.init_ = function() {
    _.each(mapStore.getMaps(), function(map) {
        this.mapPlayers_[map.id] = {};
        this.mapMobs_[map.id] = {};
        this.mapNpcs_[map.id] = {};

    }.bind(this));
};

/**
 * @param {number} mapId
 * @param {model.Player} player
 */
Entities.prototype.addPlayer = function(mapId, player) {
    var players = this.mapPlayers_[mapId] || [];
    if (!_.contains(players, player.id)) {
        players[player.id] = player;
    }
};

/**
<<<<<<< HEAD
 * @param {number} mapId
 * @param {model.Player} player
 */
Entities.prototype.removePlayer = function(mapId, player) {
    var players = this.mapPlayers_[mapId] || [];
    delete players[player.id];
};

/**
 * @param {model.Map} map
 * @param {model.Mob} mob
 */
Entities.prototype.addMob = function(map, mob) {
    var mobs = this.mapMobs_[map.id] || [];
    if (!_.contains(mobs, mob.id)) {
        mobs[mob.id] = mob;
        map.mobCount++;
        entityListener.popMob(mob);
    }
};

/**
 * @param {model.Map} map
 * @param {model.Mob} mob
 */
Entities.prototype.removeMob = function(map, mob) {
    if (map && mob) {
        map.mobCount--;
        delete this.mapMobs_[map.id][mob.id];
    }
};

/**
 * @return {Object}
 */
Entities.prototype.getMobs = function() {
    return this.mapMobs_;
};

/**
 * @param {number mapId
 * @param {string} mobId
 * @return {model.Mob}
 */
Entities.prototype.getMobById = function(mapId, mobId) {
    if (this.mapMobs_[mapId]) {
        return this.mapMobs_[mapId][mobId] || null;
    }
};

/**
 * @param {number} mapId
 * @return {Object}
 */
Entities.prototype.getPlayersJSON = function(mapId) {
    var json = {};
    var players = this.mapPlayers_[mapId] || [];
    _.each(players, function(player, key) {
       json[key] = player.toJSON();
    });
    return json;
};


/**
 * @param {number} mapId
 * @return {Object}
 */
Entities.prototype.getMobsJSON = function(mapId) {
    var json = {};
    var mobs = this.mapMobs_[mapId] || [];
    _.each(mobs, function(mob, key) {
       json[key] = mob.toJSON();
    });
    return json;
};

/**
 * @param {Object.{userId, mapId, x, y}} data
 */
Entities.prototype.updatePlayerPosition = function(data) {
    var player = this.mapPlayers_[data.mapId][data.userId];
    if (player) {
        player.position.mapId = data.mapId;
        player.position.x = data.x;
        player.position.y = data.y;
    }
};

/**
 * @param {number} mapId
 * @param {model.Mob} ステータスを更新したmob
 */
Entities.prototype.updateMobStatus = function(mapId, mob) {
    var target = this.mapMobs_[mapId][mob.id];
    if (target) {
        target = mob;
        if (target.hp < 0) { // 死
            entityListener.kill(mob);
            this.removeMob(mapStore.getMapById(mapId), mob);
        }
    }
};

var instance_ = new Entities();

module.exports = instance_;