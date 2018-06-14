/**
 * 游戏开始界面
 * 
 */
class SceneHall extends egret.DisplayObjectContainer {
  bg: egret.Bitmap = new egret.Bitmap(RES.getRes('public_bg_jpg'))
  private hLogo: Bitmap;
  private hBtn: Button;
  private hrBtn: Button;

  private matchTip: Bitmap;
  private matchBg: Bitmap;
  private matchFDJ: Bitmap;


  constructor() {
    super();
    this.init();
    this.fListen();
    EventManager.pub('tiki/onChangeType');
  }

  init() {
    this && this.removeChildren();
    this.bg.x = 0;
    this.bg.y = -UIConfig.offsetH;
    this.bg.width = UIConfig.stageW;
    this.bg.height = UIConfig.stageH;

    this.addChild(this.bg)

    this.hLogo = new Bitmap({
      source: 'pic_logo_png',
      width: 497,
      height: 254,
      y: 203,
    })
    this.hLogo.x = (UIConfig.width - this.hLogo.width) / 2;
    this.addChild(this.hLogo);

    this.hBtn = new Button(0, 0);
    this.hBtn.y = 513;
    this.hBtn.x = (UIConfig.width - this.hBtn.width) / 2;
    this.addChild(this.hBtn);

    this.hBtn.touchEnabled = true;
    this.hBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      if (this.hBtn.Bg == "btn_public_n_png") {
         EventManager.pub('tiki/broadcastToAll','ready',{uid:GameDataManager.userID});
        this.hBtn.Bg = 'btn_public_p_png';
        this.hBtn.Type = 'btn_pic_dadf_png';
      }

      if (GameDataManager.robotId != null) {
        EventManager.pub('tiki/stopTimerWaiting')
      }

    }, this)



    this.hrBtn = new Button(1, 3);
    this.hrBtn.y = 640;
    this.hrBtn.x = (UIConfig.width - this.hrBtn.width) / 2;
    this.addChild(this.hrBtn);
    this.hrBtn.touchEnabled = true;

    this.hrBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      console.log('开始匹配')
      EventManager.pub('tiki/onChangeOpp')
      // EventManager.pub('SceneHall/startMatch')
      if (GameDataManager.robotId != null) {
        EventManager.pub('tiki/stopTimerWaiting')
      }
    }, this)

    this.matchTip = new Bitmap({
      source: 'pic_jazai_png',
    })
    this.matchTip.y = 700;
    this.matchTip.x = (UIConfig.stageW - this.matchTip.width) / 2;
    this.matchTip.visible = false;
    this.addChild(this.matchTip);


    this.matchBg = new Bitmap({
      source: 'pic_loding_png',
      y: 500,
    })
    this.matchBg.x = (UIConfig.width - this.matchBg.width) / 2;
    this.addChild(this.matchBg);
    this.matchBg.visible = false;

    this.matchFDJ = new Bitmap({
      source: 'pic_loding2_png',
      y: 650 + 45,
    })
    this.matchFDJ.anchorOffsetX = (this.matchFDJ.width) / 2;
    this.matchFDJ.anchorOffsetY = (this.matchFDJ.height) / 2;
    this.matchFDJ.x = (UIConfig.width - this.matchFDJ.width) / 2 + (this.matchFDJ.width) / 2;
    this.addChild(this.matchFDJ);
    this.matchFDJ.visible = false;

    let plarMode = GameDataManager.gameType;
    if (plarMode == 0) {
      EventManager.pub('SceneHall/startMatch')
    }
    EventManager.pub('tiki/onChangeType');

  }

  fListen() {

    EventManager.sub('tiki/onChangeType', () => {
      let plarMode = GameDataManager.gameType;
      console.warn('onChangeType', plarMode)
      if (plarMode == 1) {
        this.hBtn.y = 700;
        this.hBtn.visible = true;
        this.hrBtn.visible = false;
      } else if (plarMode == 0) {
        this.hBtn.y = 513;
        this.hrBtn.visible = true;
        this.hBtn.visible = true;
      }
    })

    //玩家不准备，6s退出
    EventManager.sub('tiki/judgeRobot', () => {
      //机器人6s后自动断开
      if (GameDataManager.robotId != null) {
        EventManager.pub('tiki/startTimerWaiting')
      }
    })

    //更新排名
    EventManager.sub('updataScore', (oData) => {

      if (oData.score != null && oData.rank != null) {
      }

    });
    //显示匹配
    EventManager.sub('SceneHall/startMatch', () => {
      this.hBtn.visible = false;
      this.hrBtn.visible = false;
      this.matchTip.visible = true;

      this.matchBg.visible = true;
      this.matchFDJ.visible = true;

      let point =new egret.Point(390,580);

      AnimateManager.circleMove(this.matchFDJ,point,25)

      this.hBtn.Bg = 'btn_public_n_png';
      this.hBtn.Type = 'btn_pic_djzb_png';
    })

      // EventManager.pub('SceneHall/startMatch')

    //关闭匹配
    EventManager.sub('SceneHall/stopMatch', () => {
      console.log('关闭匹配')
      this.hBtn.visible = true;
      this.hrBtn.visible = true;
      this.matchTip.visible = false;
      this.matchBg.visible = false;
      this.matchFDJ.visible = false;
    })
  }

  onLeave() {
    this.init();
  }
}