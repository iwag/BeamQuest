/**
 * @fileoverview Entityの状態が変化した時などなどを扱う
 */

var Entity = function() {
};

Entity.prototype.listen = function(socket, io) {
    this.socket_ = socket;
    this.io_ = io;
    this.entitiesStore_ = require('beamQuest/store/entities');
};

/**
 * mobがPOPするよってクライアントに伝える
 * @param {ctrl.Mob} mob
 */
Entity.prototype.popMob = function(mob) {
    if (this.io_) {
        var data = {mob: mob.model.toJSON()};
        this.io_.sockets.emit('notify:entity:mob:pop', data);
    }
};

/**
 * mobが動いたよってクライアントに伝える
 * @param {ctrl.Mob} mob
 */
Entity.prototype.moveMob = function(mob) {
    if (this.io_) {
        this.io_.sockets.emit('notify:entity:mob:move', {mob: mob.model.toJSON()});
    }
};

/**
 * mobが近接攻撃の構えを取ったよってクライアントに伝える
 * @param {string} mobId
 * @param {model.Position} srcPos
 * @param {model.Position} destPos
 * @param {number} range 射程距離(px)
 * @param {number} castTime 発動までの時間(msec)
 */
Entity.prototype.startAttackShortRange = function(mobId, srcPos, destPos, range, castTime) {
    if (this.io_) {
        this.io_.sockets.emit('notify:entity:mob:startAttackShortRange',
            {
                mobId: mobId,
                srcPos: srcPos,
                destPos: destPos,
                range: range,
                castTime: castTime
            });
    }
};

/**
 * hpの増減をクライアントに伝える
 * @param {Array.<entity: model.Entity, hpAmount: number>} hpAmounts
 */
Entity.prototype.updateHp = function(hpAmounts) {
    if (this.io_) {
        var data = {
            hpAmounts: hpAmounts
        };
        _.each(hpAmounts, function(amount) {
            amount.entity.updateHp(amount.hpAmount);
        });
        this.io_.sockets.emit('notify:entity:hp:update', data);
    }
};

/**
 * Mob殺すよってクライアントに伝える
 * @param {ctrl.Mob} mob
 */
Entity.prototype.killMob = function(mob) {
    var data = {entity: mob.model.toJSON()};
    this.io_.sockets.emit('notify:entity:mob:kill', data);
    _.each(mob.hateList, function(hate) {
        this.addExp(hate.entityId, mob);
    }.bind(this));
};

/**
 * mobのもつ経験値をplayerに与える
 * @param {string} playerId
 * @param {ctrl.Mob} mob
 */
Entity.prototype.addExp = function(playerId, mob) {
    var mapId = mob.model.position.mapId;
    var player = this.entitiesStore_.getPlayerById(mapId, playerId);
    if (player) {
        player.exp += mob.model.exp;
        player.socket.emit('user:status:exp:update', {exp: mob.model.exp});
    }        
};


var instance_ = new Entity();
module.exports = instance_;