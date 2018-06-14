class Main extends egret.DisplayObjectContainer {

  public constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
  }

  private onAddToStage(event: egret.Event) {

    //初始化Resource资源加载库
    //initiate Resource loading library
    RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
    RES.loadConfig("resource/default.res.json", "resource/");
  }

  /**
   * 配置文件加载完成,开始预加载preload资源组。
   * configuration file loading is completed, start to pre-load the preload resource group
   */
  private onConfigComplete(event: RES.ResourceEvent): void {
    RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
    RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
    RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
    RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
    RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);

    RES.loadGroup("preload");
  }

  /**
   * preload资源组加载完成
   * Preload resource group is loaded
   */
  private onResourceLoadComplete(event: RES.ResourceEvent) {
    if (event.groupName == "preload") {
      RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
      RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
      RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
      RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
      this.createGameScene();
      EventManager.pub('tiki/init');
    }
  }

  /**
   * 资源组加载出错
   *  The resource group loading failed
   */
  private onItemLoadError(event: RES.ResourceEvent) {
    console.warn("Url:" + event.resItem.url + " has failed to load");
  }

  /**
   * 资源组加载出错
   *  The resource group loading failed
   */
  private onResourceLoadError(event: RES.ResourceEvent) {
    //TODO
    console.warn("Group:" + event.groupName + " has failed to load");
    //忽略加载失败的项目
    //Ignore the loading failed projects
    this.onResourceLoadComplete(event);
  }

  /**
   * preload资源组加载进度
   * Loading process of preload resource group
   */
  private onResourceProgress(event: RES.ResourceEvent) {
    if (event.groupName == "preload") {
      let prg = Math.floor((event.itemsLoaded - 1) * 100 / event.itemsTotal);
      if (prg == 100) {
        prg = 99;
      }
      EventManager.pub('tiki/setProgress', prg)
    }
  }

  private textfield: egret.TextField;
  private gameBgm: egret.Sound;
  private soundChannel: egret.SoundChannel
  /**
   * 创建游戏场景
   * Create a game scene
   */
  private createGameScene() {
    setTimeout(() => {
      EventManager.pub('tiki/setProgress', 100);
    }, 300)
    UImanager = new UIManager(this);
    UImanager.to('game');

    this.gameBgm = RES.getRes("carbgm_mp3");
    // this.soundChannel = this.gameBgm.play(0, -1);

    EventManager.sub('tiki/musicLoadSuc', () => {
      if (this.soundChannel) {
        this.soundChannel.stop();
        this.soundChannel = null;
      }
      this.soundChannel = this.gameBgm.play(0, -1);
      GameDataManager['recoredSoundType'] = true;
    })
    EventManager.sub('tiki/musicStop', () => {
      if (this.soundChannel) {
        this.soundChannel.stop();
        this.soundChannel = null;
        console.log('原声音移除')
      }
      GameDataManager['recoredSoundType'] = false;
    })
  }
}
