EventManager.sub('tiki/int', function () {
  tikiInit.init();
})
var tikiInit = {
  timerWaitingOppVideo: null,
  init: function () {
    var self = this;

    // setTimeout(function () {
    //   console.log('返回異常')
    //   id = Math.floor(Math.random() * 1000);
    //   GameData.nId = id;
    //   GameData.roomId = 1;
    //   Connection.initWS('localhost:5555');
    // }, 0)

    TikiGame.$(function (_initData) {
      // 所有sdk函数在此内部调用
      // 回调内参数 auth.data 内包含了当前用户自己的信息
      _initData = _initData || {};
      var code = _initData.code;
      self.fListen();
      if (code != -100) {
        // 认证成功，tiki内打开
        console.warn('code:', code);
        if (code == 1000) {
          // 非电话版本
          console.warn('init', 0)
          GameDataManager.gameType = 0;
          EventManager.pub('tiki/onChangeType', 0);
          EventManager.pub('tiki/getScore');
          // 显示自己的视频
          TikiGame.addLocalCameraView({
            x: 0
            , y: GameDataManager.offsetH
            , width: videoSize
            , height: videoSize
          });
        } else if (code == 0) {
          EventManager.pub('SceneHall/stopMatch');
          // 电话版本
          console.warn('init', 1)
          GameDataManager.gameType = 1;
          EventManager.pub('tiki/onChangeType', 1);
          EventManager.pub('tiki/getScore');
          EventManager.pub('tiki/dataReset', _initData);
          TikiGame.addLocalCameraView({
            x: 0
            , y: GameDataManager.offsetH
            , width: videoSize
            , height: videoSize
          });
          EventManager.pub('tiki/onShowOppVideo');
        }
      } else {
        // 认证失败
        // 错误，网页打开
      }
    });
  },
  fListen: function () {
    var self = this;
    // if (navigator.userAgent.match(/SafeAreaTop\/([^\s]*)/)) {
    //   GameDataManager.offsetH = navigator.userAgent.match(/SafeAreaTop\/([^\s]*)/)[1] || 0;
    //   GameDataManager.offsetH = parseInt(GameDataManager.offsetH);
    // }
    // document.querySelector('.video').style.top = GameDataManager.offsetH + 'px';
    // 获取自己信息
    TikiGame.getCurrentUser(function (resp) {
      console.warn('getCurrentUser', resp)
      if (resp.code == 0) {
        GameDataManager.dataSelf = resp.me;
        EventManager.pub('tiki/updataSelfName')
        document.querySelector('#avatar1').src = resp.me.avatar;
      }
    });
    // 显示退出游戏按钮
    TikiGame.setCloseButtonPosition({
      x: videoSize * 2 - 85
      , y: 5 + GameDataManager.offsetH
      , width: 80
      , height: 80
    });
    // 自己开关视频
    TikiGame.onSelfMute(function (resp) {
      if (resp.code == 0) {
        if (!resp.enableVideo) {
          TikiGame.removeLocalCameraView();
        } else {
          TikiGame.addLocalCameraView({
            x: 0
            , y: GameDataManager.offsetH
            , width: videoSize
            , height: videoSize
          });
        }
      }
    });
    // 对方开关视频
    TikiGame.onOpponentMute(function (resp) {
      if (resp.code == 0) {
        if (!resp.enableVideo) {
          TikiGame.removeRemoteCameraView();
        } else {
          TikiGame.addRemoteCameraView({
            x: videoSize
            , y: GameDataManager.offsetH
            , width: videoSize
            , height: videoSize
          }, GameDataManager.roomId);
        }
      }
    });

    Connection.init();
    EventManager.sub('tiki/onShowOppVideo', function () {
      TikiGame.addRemoteCameraView({
        x: videoSize
        , y: GameDataManager.offsetH
        , width: videoSize
        , height: videoSize
      }, GameDataManager.roomId);
    });

    EventManager.sub('tiki/onHideOppVideo', function () {
      TikiGame.removeRemoteCameraView();
    });
    TikiGame.onConnectStatus(function (resp) {
      if (resp.code == 0) {
        // 成功建立连接
        console.log('建立视频连接成功')
        EventManager.pub('tiki/musicLoadSuc');
      } 
    });

    EventManager.sub('tiki/onHideOppAvatar', function () {
      EventManager.pub('tiki/onHideOppVideo');
      document.querySelector('#avatar2').src = '';
      document.querySelector('#avatar2W').style.display = 'none';
    })

    EventManager.sub('tiki/setProgress', function (progress) {
      TikiGame.setNativeLoadingProgress(progress);
      if (progress == 100) {
        console.warn(progress);
        TikiGame.showGameView();
        if (GameDataManager.gameType == 0) {
          EventManager.pub('tiki/onChangeOpp');
        }
      }
    })

    EventManager.sub('tiki/onChangeOpp', function (notByMe) {
      console.info('changeopp')
      Connection.status = 1;
      GameDataManager.roomId && TikiGame.leaveRoomByRoomId(GameDataManager.roomId);
      EventManager.pub('tiki/stopTimerWaiting');
      if (!notByMe) {
        console.info('isByMe')
        Connection.ws && Connection.ws.close();
        GameDataManager.roomId = null;
      }
      EventManager.pub('tiki/onHideOppAvatar');
      EventManager.pub('SceneHall/startMatch');
      TikiGame.matchUser(function (_initData) {
        console.log('重新匹配')
        EventManager.pub('SceneHall/stopMatch');
        EventManager.pub('tiki/dataReset', _initData);
        EventManager.pub('tiki/onShowOppVideo');
      });
    })

    EventManager.sub('tiki/dataReset', function (data) {
      console.info(data)

      var oldRoomId = GameDataManager.roomId;
      var sio = data.socketioURL;
      Connection.sio = sio;
      // console.log('收到房间数据：', data);
      GameDataManager.dataSelf = data.me;
      document.querySelector('#avatar1').src = data.me.avatar;

      var otherData = data.others[0] || {};
      GameDataManager.dataOpp = otherData;
      GameDataManager.roomId = data.roomId;
      if (data.isRobot) {
        GameDataManager.robotId = otherData.uid;
      } else {
        GameDataManager.robotId = null;
      }

      GameData.roomId = data.roomId;
      GameData.nId = data.me.uid;


      if (otherData && otherData.avatar) {
        document.querySelector('#avatar2W').style.display = 'block';
        document.querySelector('#avatar2').src = otherData.avatar
      }


      EventManager.pub('tiki/getScore');

      EventManager.pub('topbar/updataNickname');

      if (data.roomId == oldRoomId) {
        // 匹配到同房间，不操作
      } else {
        Connection.initWS(sio);
      }
      Connection.status = 0;

      EventManager.pub('tiki/judgeRobot');
    })
    EventManager.sub('tiki/getScore', function () {
      // 获取得分
      TikiGame.getUserScore(function (resp) {
        // resp.score;// 在pa内的得分
        // resp.rank; //在pa内的排行
        GameDataManager.score = resp.score;
        GameDataManager.rank = resp.rank;
        EventManager.pub('bottomBar/updataScore')
      });
    })
    //返回得分
    EventManager.sub("returnScore", function (rtScore, oppScore) {
      console.warn('上传分数', rtScore, oppScore)
      TikiGame.increaseScore(rtScore, function (resp) {
        GameDataManager.score = resp.score;
        GameDataManager.rank = resp.rank;
        EventManager.pub('bottomBar/updataScore')
      });
      if (GameDataManager.robotId) {
        TikiGame.increaseScore(oppScore, GameDataManager.robotId, function (resp) {
        });
      }
    });

    //结束游戏
    EventManager.sub("closeGame", function () {
      TikiGame.exitView(true);
    });

    // 计时6s自动换人
    var timerWaiting = null;
    EventManager.sub('tiki/startTimerWaiting', function () {
      clearTimeout(timerWaiting);
      timerWaiting = null;
      timerWaiting = setTimeout(function () {
        UImanager.to('hall');
        EventManager.pub('tiki/onChangeOpp');
      }, 6000)
    })
    EventManager.sub('tiki/stopTimerWaiting', function () {
      clearTimeout(timerWaiting);
      timerWaiting = null;
    })
  }
}