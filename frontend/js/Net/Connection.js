/**
 * websocket连接模块
 */
var Connection = {
  ws: null,
  flagFinished: false,
  flagReceived: false,
  init: function () {
    var self = this;
    EventManager.sub("sendMessage", function (protocol, data) {
      console.log(protocol, data)
      self.ws.emit(protocol, data);
    });
  },
  //初始化socket
  initWS: function (host) {
    console.warn('intws')
    var self = this;

    this.flagFinished = false;
    this.flagReceived = false;
    if (this.ws) {
      this.sendMessage('disconnect')
      this.ws.sendDisconnect();
    }
    // 设置禁止自动重连
    this.ws = TikigameConnector(host);
    var ws = this.ws;

    ws.on("connect", function (e) {
      self.fListen();
      console.log("连接成功");
    });

    ws.on("disconnect", function () {
      clearInterval(self.timerUserInfo);
      self.timerUserInfo = null;
    });

  },
  broadCast: function (eventName, data) {
    var ws = this.ws;
    ws.sendMessage({
      data: data,
      eventName: eventName
    });
  },
  sendMessage: function (eventName, data) {
    var ws = this.ws;
    ws.sendMessageToOther({
      data: data,
      eventName: eventName
    });
  },
  playAgain: function () {
    if (this.flagReceived) {
      console.log('收到对方信息')
      this.sendMessage('respUserInfo', { nid: GameData.nId })
      EventManager.pub('startGame', { number: GameData.number })
    } else {
      this.sendMessage('reqUserInfo', { nid: GameData.nId })
    }
  },
  fListen: function () {
    var ws = this.ws;
    var self = this;
    if (GameDataManager.robotId) {
      GameData.number = 1;
      EventManager.pub('startGame', { number: GameData.number })
    } else {
      self.timerUserInfo = setInterval(function () {
        self.sendMessage('reqUserInfo', { nid: GameData.nId })
      }, 500);
    }

    ws.on('chat', function (resp) {
      var data = resp.data.data;
      if (!resp.data || !resp.data.eventName) {
        return;
      }
      switch (resp.data.eventName) {
        case 'reqUserInfo': {
          self.flagReceived = true;
          if (!self.flagFinished) {
            console.log('收到对方信息', resp.data)
            self.sendMessage('respUserInfo', { nid: GameData.nId })
          }
          break;
        }
        case 'respUserInfo': {
          // 对方收到己方信息
          clearInterval(self.timerUserInfo);
          self.timerUserInfo = null;
          if (data.nid < GameData.nId) {
            GameData.number = 3
          } else {
            GameData.number = 1
          }
          EventManager.pub('startGame', { number: GameData.number })
          self.flagFinished = false;
          break;
        }
        case 'moveX': {
          EventManager.pub('oppMoveX', data)
          break;
        }
        case 'crash': {
          EventManager.pub('oppCrash', data)
          break;
        }
        case 'sendResult': {
          console.log('gameOver', data)
          self.flagFinished = true;
          self.flagReceived = false;
          EventManager.pub('gameOver', data);
          break;
        }
        case 'disconnect': {
          if (!this.flagFinished) {
            // self.ws && self.ws.sendDisconnect();
          }
          break;
        }
      }
    })
  },
  onMsg: function () {
    var ws = this.ws;
    //接收到服务器信息、解析、分发
  }
};
Connection.init();
