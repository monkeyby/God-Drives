/**
 * @author:qly
 */

class AnimateManager {
  // 圆动画，point圆心，r半径，(未调整anchor偏移，需自行调整以优化视觉效果)
  static async circleMove(obj, point: egret.Point, r, angleStart = 360, angleEnd = 0, duration = 2000, isLoop = true) {
    let funcChange = function () {
      this.x = point.x + r * Math.cos(this.angle * Math.PI / 180);
      this.y = point.y - r * Math.sin(this.angle * Math.PI / 180);
    }
    egret.Tween.get(obj, { onChange: funcChange, onChangeObj: obj, loop: isLoop })
      .set({
        angle: angleStart,
        x: point.x + r * Math.cos(angleStart * Math.PI / 180),
        y: point.y - r * Math.sin(angleStart * Math.PI / 180)
      })
      .to({
        angle: angleEnd
      }, duration)
  }

  static createDragonBoneAni(sourceName, width = 0, height = 0, skeName = ''): dragonBones.EgretArmatureDisplay {
    skeName = skeName || sourceName;
    //定义dragonBones.EgretFactory对象
    let factory: dragonBones.EgretFactory;
    factory = new dragonBones.EgretFactory();
    factory.parseDragonBonesData(RES.getRes(sourceName + "_ske_json"));
    factory.parseTextureAtlasData(RES.getRes(sourceName + "_tex_json"), RES.getRes(sourceName + "_tex_png"));
    //直接生成骨骼动画显示对象，该对象实现IArmatureDisplay接口
    var ar: dragonBones.EgretArmatureDisplay = factory.buildArmatureDisplay(skeName);

    width && (ar.scaleX = width / ar.width);
    height && (ar.scaleY = height / ar.height);
    return ar;
  }

}