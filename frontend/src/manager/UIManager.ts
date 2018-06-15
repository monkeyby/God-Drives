class UIConfig {
  public static useTransition: boolean = true //是否使用场景过度动画
  public static width: number = 750 //设计稿宽度
  public static height: number = 1334 //设计稿高度
  public static stageW: number = 0  //舞台宽度
  public static stageH: number = 0  //舞台高度
  public static offsetW: number = 0  //(舞台宽度-设计稿宽度)/2
  public static offsetH: number = 0  //(舞台高度-设计稿高度)/2

  public static sceneScaleWidth: number = 1;
  public static sceneScaleHeight: number = 1;
  public static deviceWidth: number = 0;
  public static deviceHeight: number = 0;

}

interface NormalScene extends egret.DisplayObjectContainer {
  bg?: egret.Bitmap
  onEnter?: () => void  //每次进入场景前调用
  onLeave?: () => void
  onResize?: () => void
  noAutoResize?: boolean
}

class UIManager {
  public info: Object = {};
  // 设置最外层入口容器
  public container: egret.DisplayObjectContainer
  // 存放当前主场景，唯一
  public currentScene: NormalScene

  // 初始化主要场景,index 0
  private sceneHall: NormalScene
  private sceneGame: NormalScene
  private sceneOver: NormalScene
  // 结算层,index 20
  // private sceneResult: GameResult

  // 初始化弹层场景 ,index 50
  private currentModal: any;
  private modalOffline: OfflineModal;

  // 顶层bar
  private barBottom: BarBottom;


  // 顶层两个动画



  constructor(layer) {
    this.setContainer(layer);
    // this.barTop = new BarTop();
    // this.container.addChildAt(this.barTop, 1);

    // this.clock = new Clock();
    // this.container.addChildAt(this.clock,2);

    // this.barBottom = new BarBottom();
    // this.barBottom.x = (UIConfig.stageW - this.barBottom.width)/2;
    // this.barBottom.y = (UIConfig.stageH - this.barBottom.height);
    // this.container.addChildAt(this.barBottom, 1);


  }
  fListen() {
    let self = this;

    EventManager.sub('modal/onShowModal', function (modalType, obj = {}) {
      self.showModal(modalType, obj);
    })

    EventManager.sub('modal/onModalClose', () => {
      if (this.currentModal) {
        if (this.currentModal.parent) {
          egret.Tween.removeTweens(this.currentModal);
          egret.Tween.get(this.currentModal).to({ alpha: 0 }, 200).call(() => {
            if (this.currentModal.parent) {
              this.container.removeChild(this.currentModal);
            }
            this.currentModal = undefined;
          })
        } else {
          this.currentModal = undefined;
        }
      }
    })

    EventManager.sub('modal/onCloseOffline', () => {
      if (this.modalOffline && this.modalOffline.parent) {
        this.container.removeChild(this.modalOffline);
      }
    })

    EventManager.sub('modal/onShowOffline', (obj = {}) => {
      this.modalOffline = this.modalOffline || new OfflineModal();
      this.modalOffline.spText.text = obj['text'];
      this.container.addChildAt(this.modalOffline, 50);
    })

  }

  setContainer(layer) {
    this.container = layer
    // 初始化舞台大小
    let stage: egret.Stage = egret.MainContext.instance.stage
    UIConfig.stageW = stage.stageWidth

    UIConfig.stageH = stage.stageHeight;
    
    UIConfig.deviceHeight = egret.Capabilities.boundingClientHeight;
    UIConfig.deviceWidth = egret.Capabilities.boundingClientWidth;

    switch (UIConfig.deviceWidth) {
      case 320: UIConfig.deviceWidth *= 2; break;
      case 375: UIConfig.deviceWidth *= 2; break;
      case 414: UIConfig.deviceWidth *= 2; break;
    }
    UIConfig.offsetW = (stage.stageWidth - UIConfig.width) / 2
    UIConfig.offsetH = (UIConfig.stageH - UIConfig.height) / 2;
    // 重排容器
    this.container.width = UIConfig.stageW;
    this.container.height = UIConfig.stageH;
    // this.container.y = UIConfig.stageW / 2 ;

    var oriRateWidth = 720 / 750;
    var oriRateHeight = 720 / 959;

    GameDataManager.chessBoardW = UIConfig.stageW * oriRateWidth;
    GameDataManager.chessBoardH = UIConfig.stageH * oriRateHeight;



    console.log('实际场景大小：', UIConfig.stageW, UIConfig.stageH);
    console.log('实际棋盘的宽高：', UIConfig.stageW * oriRateWidth, UIConfig.stageH * oriRateHeight);


    this.fListen();
  }

  showModal(type, args = {}) {
    //   // 0个人信息,1设置
    let modal: ModalLayer;
    switch (type) {
      case 0: {
        break;
      }
      case 1: {
        break;
      }
      case 2: {

        break;
      }
      case 3: {

        break;
      }
    }
    if (this.currentModal) {
      this.container.removeChild(this.currentModal);
      this.currentModal = undefined;
    }
    if (modal) {
      this.currentModal = modal;
      this.container.addChildAt(modal, 50);
      if (args['type'] == 1) {
        EventManager.pub("startCT", 1);
      } else if (args['type'] == 2) {
        EventManager.pub("startCT", 2);
      }

    } else {
      console.warn('modal类型未定义')
    }
  }

  async to(name) {
    // 清除所有已打开弹窗
    // EventManager.pub('modal/onModalClose');
    switch (name) {
      case 'hall': {
        // this.sceneHall = this.sceneHall || new SceneHall();
        // this.add(this.sceneHall)
        // break
      }
      case 'game': {
        console.log('进入游戏场景')
        this.sceneGame = this.sceneGame || new SceneGame();
        // this.sceneGame.gameStartInit();
        this.add(this.sceneGame)
        break
      }
      case 'over': {
        // this.sceneOver = this.sceneOver || new SceneOver();
        // this.add(this.sceneOver)
        // EventManager.pub('clearReadyData');
        // EventManager.pub('ResultBar/updataScore')
        // this.barBottom.visible = true;

        // //机器人再来一局逻辑
        // this.robotReady();

        // //机器人6s后强制自动断开
        // if (GameDataManager.robotId != null) {
        //   EventManager.pub('tiki/startTimerWaiting');
        // }
        // break;
      }
    }
  }
  async add(scene: NormalScene) {
    // 移除原场景
    if (this.currentScene) {
      // 跳转到当前场景时返回
      if (this.currentScene == scene) {
        this.currentScene.onLeave && this.currentScene.onLeave();
        this.currentScene.onEnter && this.currentScene.onEnter();
        return;
      }
      await this.remove(this.currentScene)
      console.log('====原场景已移除====')
    }
    // 计算场景大小
    // scene.width = UIConfig.width
    // scene.height = UIConfig.height
    // scene.x = (UIConfig.stageW - UIConfig.width) / 2
    // scene.y = UIConfig.offsetH

    // 执行场景中定义的onEnter方法
    let onEnter = scene.onEnter || new Function;
    scene.once(egret.Event.ADDED_TO_STAGE, onEnter, scene);
    // 加载新场景
    this.container.addChildAt(scene, 0)
    console.log('====加载新场景成功====')
    this.currentScene = scene
    if (UIConfig.useTransition) {
      await this.transform(scene)
    }
  }

  async remove(scene) {
    if (this.container.contains(scene)) {
      if (UIConfig.useTransition) {
        await this.transform(scene, false)
      }
      // 执行场景中定义的onLeave方法
      scene.onLeave && scene.onLeave()
      scene && scene.parent && this.container.removeChild(scene)
      this.currentScene = undefined
    }
  }
  async transform(ele, direction = true, duration = 300) {
    let start = {
      alpha: 0
    }
    let end = {
      alpha: 1
    }
    if (!direction) {
      // 调换start，end状态
      [start, end] = [end, start]
    }
    await (() => {
      return new Promise((resolve, reject) => {
        egret.Tween.get(ele).set(start).to(end, duration).call(function () {
          resolve()
        })
      })
    })()
  }

  createFrames(sourceName): egret.MovieClip {
    let mcDataFactory = new egret.MovieClipDataFactory(RES.getRes(sourceName + '_json'), RES.getRes(sourceName + '_png'));
    let mc: egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData(sourceName));
    return mc;
  }

  robotReady() {
    console.log('检测机器人：', GameDataManager.robotId)
    if (GameDataManager.robotId != null) {
      if (GameDataManager.robotPlayCount < 2) {
        setTimeout(function () {
          EventManager.pub('tiki/broadcastToAll', 'ready', { uid: GameDataManager.oppID });
        }, Math.random() * 5000) //准备时间0-5s随机
      }
      if (GameDataManager.robotPlayCount >= 2 && GameDataManager.robotPlayCount <= 5) {
        if (Math.random() > 0.5) { //一半概率离开
          setTimeout(function () {
            EventManager.pub('tiki/broadcastToAll', 'ready', { uid: GameDataManager.oppID });
          }, Math.random() * 5000) //准备时间0-5s随机
        } else {
          //机器人自动离开
          UImanager.to('hall');
          EventManager.pub('tiki/onChangeOpp');
        }
      }
      if (GameDataManager.robotPlayCount >= 2 && GameDataManager.robotPlayCount > 5) {
        //机器人自动离开
        UImanager.to('hall');
        EventManager.pub('tiki/onChangeOpp');
      }
    }
  }

}

// 注册全局管理器
let UImanager