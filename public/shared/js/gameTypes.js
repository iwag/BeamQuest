/**
 * @fileoverview サーバ側と共通して使う変数などを定義していく
 * @see https://github.com/mozilla/BrowserQuest/blob/master/shared/js/gametypes.js
 */

bq = {};

bq.Types = {
    Entities: {
        // keyを設定していく。valueはkeyの小文字でよろ
        PLAYER: 'player',

        // Mobs
        KAMUTARO: 'kamutaro'
    },

    Beams: {
        NORMAL: 'normal',
        FIRE: 'fire'
    }
};