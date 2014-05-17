bq.beam.BeamFactory = cc.Class.extend({

    createParticleBeam: function (beamType, shooterId, tag) {
        "use strict";
        var beam = new bq.beam.Beam(beamType, shooterId, tag);
        // パーティクルとテクスチャをセット
        // TODO これもっとうまく書く方法あるはずだし、別のクラスgameType?に移した方がいい
        var beamType2Partile = {};
        beamType2Partile[bq.Types.Beams.FIRE] = cc.ParticleSun;
        beamType2Partile[bq.Types.Beams.METEOR] = cc.ParticleMeteor;

        var particle = beamType2Partile[beamType];
        var myTexture = cc.TextureCache.getInstance().textureForKey(s_Beam0);

        particle.setTexture(myTexture);
        particle.setPosition(cc.p(0, 0));
        beam.addChild(particle);
        beam.disable();

        return beam;
    },

    createSpriteBeam: function (beamType, shooterId, tag) {
        "use strict";
        var beam = new bq.beam.Beam(beamType, shooterId, tag);

        var beamType2textureName = {};
        // TODO これもっとうまく書く方法あるはずだし、別のクラスgameType?に移した方がいい
        beamType2textureName[ bq.Types.Beams.NORMAL0] = ["large1.png", "large2.png", "large3.png", "large4.png"];
        beamType2textureName[ bq.Types.Beams.NORMAL1] = ["long1.png", "long2.png", "long3.png", "long4.png"];
        beamType2textureName[ bq.Types.Beams.NORMAL2] = ["small1.png", "small2.png", "small3.png"];

        var frames = beamType2textureName[beamType];

        var cl = cc.PhysicsSprite.createWithSpriteFrameName(frames[0]);
        cl.setBody(new cp.Body(0.01, cp.momentForBox(100, 16, 16)));
        bq.space.addBody(cl.getBody());
        cl.shape_ = new cp.BoxShape(cl.getBody(), 32, 32);
        bq.space.addShape(cl.shape_);

        var anime = bq.entity.Animation.createAnimation(frames, 0.05);
        var animation = anime && cc.RepeatForever.create(cc.Animate.create(anime));
        animation && cl.runAction(animation);

        beam.addChild(cl);
        beam.setPosition(cc.p(0, 0));

        return beam;
    },

    /**
     * Beamのファクトリ
     * 引数id にあうパーティクルのビームを作成する
     *
     * @param {bq.Types.Beams} beamType
     * @param {string} shooterId
     * @param {string} tag
     * @return {bq.beam.Beam}
     */
    create: function (beamType, shooterId, tag) {
        "use strict";
        var beam;

        var type = bq.Types.Beams;
        if (_.contains([type.FIRE, type.METEOR], beamType)) {
            beam = bq.beam.Beam.createParticleBeam(beamType, shooterId, tag);
        } else {
            beam = bq.beam.Beam.createSpriteBeam(beamType, shooterId, tag);
        }


        beam.disable();

        return beam;
    }

});