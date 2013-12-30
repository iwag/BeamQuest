var BeamQuestWorld = cc.Layer.extend({
    init:function () {
        'use strict';

        this._super();
        this.setKeyboardEnabled(true);

        var size = cc.Director.getInstance().getWinSize();
        cc.AudioEngine.getInstance().setEffectsVolume(0.5);
        cc.AudioEngine.getInstance().setMusicVolume(0.5);

        var baseLayer = cc.Layer.create();
        baseLayer.setPosition(cc.p(0,0));
        this.addChild(baseLayer, 1, bq.config.tags.BASE_LAYER);

        var playerLayer = cc.Layer.create();
        playerLayer.setPosition(cc.p(0,0));
        this.addChild(playerLayer, 100, bq.config.tags.BASE_LAYER);


        bq.player.setPosition(cc.p(size.width / 2, size.height / 2));
        playerLayer.addChild(bq.player, 0);

        var tileMap = new cc.TMXTiledMap();
        tileMap.initWithTMXFile(bq.config.maps.area.SHINJUKU);
        tileMap.setPosition(cc.p(0,0));
        baseLayer.addChild(tileMap, 0);
        this.inputHandler = new InputHandler(bq.player);
        bq.baseLayer = baseLayer;
        this.scheduleUpdate();

        this.initPing_();

        cc.AudioEngine.getInstance().playMusic(s_BgmField, true);
        return true;
    },

    /** @override */
    update: function() {
        'use strict';

        var baseP = bq.baseLayer.getPosition();
        var dx = this.inputHandler.dx;
        var dy = this.inputHandler.dy;
        if (dx !== 0 || dy !== 0) {
            bq.baseLayer.setPosition(cc.p(baseP.x + dx, baseP.y + dy));
        }
    },

    /** @override */
    onKeyDown: function(key) {
        'use strict';

        this.inputHandler.keyDown(key);
    },

    /** @override */
    onKeyUp: function(key) {
        'use strict';

        this.inputHandler.keyUp(key);
    },

    initPing_: function() {
        'use strict';

        if (! cc.Director.getInstance().isDisplayStats()) {
            return;
        }

        // ping始める
        var interval = 300;
        this.ping_ = new bq.Ping(bq.Socket.getInstance().socket, interval);
        this.ping_.start();

        // 表示用テキストを作る
        var pingText = function() {
            return "ping: " + this.ping_.getRoundTripTime();
        }.bind(this);

        // ラベル作る
        var fontSize = 16;
        var pingLabel = bq.Label.createWithShadow(pingText(), fontSize);
        pingLabel.setAnchorPoint(cc.p(0, 1.0));

        // 表示位置
        var margin = 5;
        var winSize = cc.Director.getInstance().getWinSize();
        pingLabel.setPosition(cc.p(margin, winSize.height - margin));

        // 表示内容更新処理
        pingLabel.schedule(function() {
            pingLabel.setString(pingText());
        });

        var zIndex = 10000;
        this.addChild(pingLabel, zIndex, bq.config.tags.DEBUG_PING);
    }
});

var BeamQuestWorldScene = cc.Scene.extend({
    onEnter:function () {
        'use strict';

        this._super();
        if (this.isAlreadyLogin_(bq.player.name)) {
            var layer = new BeamQuestWorld();
            layer.init();
            this.addChild(layer);
            this.renderEntities_(1); // TODO: maoId
        } else {
            this.addChild(new LoginScene());
        }
    },

    /**
     * 他Entityを描画する
     * @param {number} mapId
     * @private
     */
    renderEntities_: function(mapId) {
        var entityManager = bq.EntityManager.getInstance();
        entityManager.updateEntitiesByMapId(mapId);
    },

    /**
     * @param {string} userId
     * @return {boolean} ログイン済み（過去にログインしたことがある)ならTRUE
     * @private
     */
    isAlreadyLogin_: function(userId) {
        'use strict';

        userId = sys.localStorage.getItem('userHash:' + userId);
        return !!userId;
    }
});

