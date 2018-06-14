class Car extends egret.Sprite {
  // 加速时的加速度
  a1: number = .5;
  // 减速时的加速度
  a2: number = 1;
  // 横向匀速移动，该值不改变
  speedX = 10;
  speedY = 0;
  // 暂存左右移动方向 0不动1左2右
  dirX = 0;
  // Y轴加速阈值
  maxSpeedY = 60;
  flagMove = true;
  flagDown = false;

  // 1自己2对家3npc
  carType: number = 0;

  aniCar: dragonBones.EgretArmatureDisplay;
  anistatus: string;

  bg: Bitmap;


  speedUp() {
    let flag = false;
    this.speedY += this.a1;
    if (this.speedY > this.maxSpeedY) {
      // 加速阈值限制
      this.speedY = this.maxSpeedY;
      flag = true
    }
    this.y -= this.speedY;
    return flag;
  }

  slowDown() {
    if (this.speedY <= 0) {
      // 减速至停止
      this.speedY = 0;
      return;
    }
    this.speedY -= this.a2;
    this.y -= this.speedY;
  }

  moveLeft() {
    this.x -= this.speedX;
  }

  moveRight() {
    this.x += this.speedX;
  }
  moveX() {
    if (this.dirX == 0) {

    } else if (this.dirX == 1) {
      this.moveLeft()
    } else if (this.dirX == 2) {
      this.moveRight()
    }
  }
  constructor(type, carType = 0) {
    super();

    if (carType == 0) {
      this.maxSpeedY = 40;
    }
    this.anistatus = 'normal'

    this.carType = carType;
    let src: string;
    src = `pic_car_${type}_png`;

    this.bg = new Bitmap({
      source: src,
    })
    this.addChild(this.bg);

    this.anchorOffsetX = this.bg.width / 2;
    this.anchorOffsetY = this.bg.height / 2;


    var aniSrc = type == 1 ? 'hongche' : 'lanche';
    this.aniCar = AnimateManager.createDragonBoneAni(aniSrc);
    this.aniCar.visible = false;
    this.aniCar.x = 36;
    this.aniCar.y = 72;
    this.addChild(this.aniCar);
    this.aniCar.addEvent(dragonBones.AnimationEvent.COMPLETE, () => {
      console.log('动画完成')
      // this.aniCar.animation.play('daiji', -1)
      this.aniCar.visible = false;
      //复活后复位
      if (this.anistatus == 'fuhuo') {
        this.flagMove = true;
        this.bg.visible = true;
        this.anistatus = 'normal'
      }
    }, this)
    // this.aniCar.addEvent(dragonBones.AnimationEvent., (e) => {
    //   console.log('动画完成',e)
    //   // this.aniCar.animation.play('daiji', -1)
    //   this.aniCar.visible = false;
    // }, this)

    this.fListen();
  }

  private fListen() {
    this.addEventListener('crash', e => {
      let data = e.data;
      this.getCrash(data.speedX, data.speedY, data.type)
    }, this);
  }

  private getCrash(speedX, speedY, type) {
    this.flagMove = false;
    let diedTime = 2200;
    if (this == myCar) {
      EventManager.pub('playHitSound')
    } else {
      diedTime = 2400;
    }
    if (type == 'wall') {
      //立即播放爆炸
      this.playBoom();
      setTimeout(() => {
        if (this.anistatus == 'baozha') {
          this.x = 750 / 2 + UIConfig.offsetW;
          this.speedY = 0;
          this.playReview();
        }
      }, diedTime);
    } else if (type == 'npc') {
      // this.flagDown = true;
      this.playBoom();
      setTimeout(() => {
        if (this.anistatus == 'baozha') {
          this.x = 750 / 2 + UIConfig.offsetW;
          this.speedY = 0;
          this.playReview();
        }
        // this.flagMove = true;
        // this.flagDown = false;
      }, diedTime);
    }
  }

  testCrash() {
    let flagPass = false;
    let delY = this.y - myCar.y;
    if (delY < - UIConfig.stageH) {
      // 超出屏幕上方很远
      flagPass = true;
    } else if (delY > 400) {
      // 被超出400米
      flagPass = true;
    } else if (Math.abs(delY) <= myCar.height) {
      if (Math.abs(this.x - myCar.x) <= 73) {
        let speedX: number = myCar.speedX;
        if (this.x >= myCar.x) {
          speedX = -speedX;
        }
        if (myCar.anistatus == 'normal') {
          myCar.dispatchEventWith('crash', false, {
            speedX: speedX,
            speedY: this.speedY - myCar.speedY,
            type: 'npc'
          })
          Connection.sendMessage('crash', {
            speedX: speedX,
            speedY: this.speedY - myCar.speedY,
            type: 'npc'
          })
        }
      }
    }
    return flagPass;
  }

  playBoom() {
    this.bg.visible = false;
    this.aniCar.visible = true;
    this.aniCar.animation.play('baozha', 1)
    this.anistatus = 'baozha';
    this.speedY = 0;
  }

  playReview() {
    this.bg.visible = false;
    this.aniCar.visible = true;
    this.aniCar.animation.play('fuhuo', 1);
    this.anistatus = 'fuhuo';
  }


}