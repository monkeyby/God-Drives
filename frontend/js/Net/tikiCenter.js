var tikiCenter = {
  init: function () {
    this.fListen();
  },
  fListen: function () {
    TikiGame.onReady(function (data) {
      // EventManager.pub('resetGame')
      console.log('onReady:', data);
      var oldRoomId = GameDataManager.roomId;
      var sio = data.socketioURL;
      // sio = sio.replace('112.124.112.61', '116.62.204.200');
      Connection.sio = sio;
      GameDataManager.dataSelf = data.me;

      GameDataManager.oppID = data.me.uid;
      GameDataManager.userID = data.others[0].uid;

      var otherData = data.others[0] || {};
      GameDataManager.dataOpp = otherData;
      GameDataManager.roomId = data.roomId;
      GameData.roomId = data.roomId;
      GameData.nId = data.me.uid;
      if (data.isRobot) {
        GameDataManager.robotId = otherData.uid;
      } else {
        GameDataManager.robotId = null;
      }

      Connection.initWS(sio);
      // if (data.playCount && data.playCount > 1) {
      //   // 继续游戏
      //   Connection.playAgain();
      // } else {
      //   // 开始新游戏，初始化ws
      //   Connection.initWS(sio);
      // }
    })

    TikiGame.onMuteBgm(function (_resp) {
      if (_resp.enable) {
        EventManager.pub('tiki/musicLoadSuc')
      } else {
        EventManager.pub('tiki/musicStop')
      }
    });

    EventManager.sub('tiki/uploadScore', function (winId) {
      console.log(winId)
      var isWin = GameDataManager.userID == winId;
      var winScore = GameDataManager.winScore;
      // 计算游戏分数上报
      TikiGame.gameEnd({
        selfScore: isWin ? winScore : -winScore,
        oppoScore: isWin ? -winScore : winScore,
        gameResult: isWin ? 1 : -1
      });
    })
  }
}

EventManager.sub('tiki/init', function () {
  TikiGame.$(function () {
    tikiCenter.init();

    // id = Math.floor(Math.random() * 1000);
    // GameData.nId = id;
    // GameData.roomId = 1;
    // Connection.initWS('112.124.112.61:9092?_d=gameId&_t=1&cid=' + id);
  });
})