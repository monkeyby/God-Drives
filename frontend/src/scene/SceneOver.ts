// /**
//  * 游戏結束界面
//  * 
//  */
// class SceneOver extends egret.DisplayObjectContainer {
//   public bg: egret.Bitmap = new egret.Bitmap(RES.getRes('pic_yx_bg_png'))
//   private mapBg: egret.Bitmap = new egret.Bitmap(RES.getRes('pic_qp_png'))


//   private oRePlayBtn: Button;

//   private ohuanrenBtn: Button;;




//   constructor() {
//     super();

//     this.init();
//     this.fListen();
//   }

//   init() {
//     this && this.removeChildren();

//     let relY = (185 / 959) * UIConfig.stageH;

//     let stdChessWH: number;
//     //选取长宽教小的进行适配
//     if (GameDataManager.chessBoardH >= GameDataManager.chessBoardW) {
//       stdChessWH = GameDataManager.chessBoardW;
//     } else if (GameDataManager.chessBoardH < GameDataManager.chessBoardW) {
//       stdChessWH = GameDataManager.chessBoardH;
//     }

//     this.mapBg.width = stdChessWH;
//     this.mapBg.height = stdChessWH;


//     this.mapBg.x = (UIConfig.stageW - this.mapBg.width) / 2;
//     this.mapBg.y = relY;

//     this.addChild(this.mapBg)
//     this.bg.x = 0;
//     this.bg.y = 0;
//     this.bg.width = UIConfig.stageW;
//     this.bg.height = UIConfig.stageH;
//     this.addChild(this.bg)

//     console.log('UIConfig.stageW;', UIConfig.stageW)
//     console.log('UIConfig.stageW;', UIConfig.stageW)


//     //再来一局
//     this.oRePlayBtn = new Button(0, 2);
//     this.oRePlayBtn.y = 620;
//     this.oRePlayBtn.x = (UIConfig.stageW - this.oRePlayBtn.width) / 2 - UIConfig.offsetW;
//     this.addChild(this.oRePlayBtn);

//     this.oRePlayBtn.touchEnabled = true;
//     this.oRePlayBtn.visible = true;
//     this.oRePlayBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
//       if (this.oRePlayBtn.Type == "btn_pic_hdsy_png") {
//         EventManager.pub('tiki/broadcastToAll', 'ready', { uid: GameDataManager.userID });
//         this.oRePlayBtn.Bg = 'btn_public_p_png';
//         this.oRePlayBtn.Type = 'btn_pic_dadf_png';
//         if (GameDataManager.robotId != null) {
//           EventManager.pub('tiki/stopTimerWaiting')
//         }
//       }

//     }, this)


//     this.ohuanrenBtn = new Button(1, 4);
//     this.ohuanrenBtn.y = 750;
//     this.ohuanrenBtn.x = (UIConfig.stageW - this.ohuanrenBtn.width) / 2 - UIConfig.offsetW;
//     this.addChild(this.ohuanrenBtn);

//     this.ohuanrenBtn.touchEnabled = true;
//     this.ohuanrenBtn.visible = true;
//     this.ohuanrenBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
//       UImanager.to('hall')
//       EventManager.pub('tiki/onChangeOpp')
//       if (GameDataManager.robotId != null) {
//         EventManager.pub('tiki/stopTimerWaiting')
//       }
//     }, this)
//     EventManager.pub('tiki/onChangeType');
//   }

//   fListen() {

//     EventManager.sub('tiki/onChangeType', () => {
//       let plarMode = GameDataManager.gameType;
//       if (plarMode == 1) {
//         this.oRePlayBtn.y = 750;
//         this.oRePlayBtn.visible = true;
//         this.ohuanrenBtn.visible = false;
//       } else if (plarMode == 0) {
//         this.oRePlayBtn.y = 620;
//         this.ohuanrenBtn.visible = true;
//         this.oRePlayBtn.visible = true;
//       }
//     })

//     EventManager.sub('carculateResult', () => {
//     })

//     EventManager.pub('tiki/onChangeType');

//     //更新排名
//     EventManager.sub('updataScore', (oData) => {

//       if (oData.score != null && oData.rank != null) {

//       }


//     });
//   }


//   onLeave() {
//     this.oRePlayBtn.Bg = 'btn_public_n_png';
//     this.oRePlayBtn.Type = 'btn_pic_hdsy_png';
//     this.oRePlayBtn.x = (UIConfig.stageW - this.oRePlayBtn.width) / 2 - UIConfig.offsetW;

//     this.ohuanrenBtn.Bg = 'btn_public_png';
//     this.ohuanrenBtn.Type = 'btn_gnds_png';
//     this.ohuanrenBtn.x = (UIConfig.stageW - this.oRePlayBtn.width) / 2 - UIConfig.offsetW;

//   }
// }