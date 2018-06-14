class BarBottom extends egret.Sprite {
  private hScore: ScoreBar;
  private hRank: ScoreBar;

  private shapeBg : egret.Shape

  constructor() {
    super();

    this.shapeBg = new egret.Shape();
    this.shapeBg.graphics.beginFill(0x000000,0.2);
    this.shapeBg.graphics.drawRect(0,0,UIConfig.stageW + 100,50);
    this.shapeBg.graphics.endFill();
    this.addChild(this.shapeBg);

    this.hScore = new ScoreBar(0);
    this.hScore.x = 120;
    this.hScore.y = 5;
    this.addChild(this.hScore)

    this.hRank = new ScoreBar(1);
    this.hRank.x = 430;
    this.hRank.y = 5;
    this.addChild(this.hRank);

    //更新排名、分数
    EventManager.sub('bottomBar/updataScore',()=>{
      this.hScore.score = GameDataManager.score.toString();
      this.hRank.score = GameDataManager.rank.toString();
    })

    EventManager.sub('changeButtomBar', (data) => {
      if (data == 0) {
        this.hScore.visible = false;
        this.hRank.visible = false;
        
      } else {
        this.hScore.visible = true;
        this.hRank.visible = true;
      }
    })


    EventManager.pub('bottomBar/updataScore')

  }

}