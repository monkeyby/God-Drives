var io = require("socket.io");
var fs = require("fs");

var service = require("./service/function");
var express = require("express");
var app = express();
var PROTOCOL = require("./service/protocol");
var path = require("path");

var process = require("process");

let configPort = require("./config/PORT");

var port = (function() {
  if (typeof process.argv[2] !== "undefined") {
    // 如果输入了端口号，则提取出来
    if (isNaN(process.argv[2])) {
      // 如果端口号不为数字，提示格式错误
      let portEnv = process.argv[2];
      if (configPort[portEnv]) {
        console.log(configPort[portEnv]);
        return configPort[portEnv];
      } else {
        throw "环境错误";
      }
    } else {
      // 如果端口号输入正确，将其应用到端口
      return process.argv[2];
    }
  } else {
    // 如果未输入端口号，则使用下面定义的默认端口
    return 5555;
  }
})();

var roomList = {};
var userList = {};

var ws = io.listen(port);

ws.on("connection", function(socket) {
  var userInfo = {};
  var roomCenter = {};
  var gameCenter = {};
  var id = 0;
  socket.on(PROTOCOL.REQJOINROOM, data => {
    userInfo = {
      name: data.nickname || "",
      id: data.id || 0,
      roomid: data.roomid
    };
    id = data["id"] || 0;
    // 请求加入房间
    if (!roomList[data.roomid]) {
      // 不存在房间，初始化新房间
      roomList[data.roomid] = service.createRoom(data.roomid);
    }
    roomList[data.roomid].setOnline(id);
    roomCenter = roomList[data.roomid];
    gameCenter = roomCenter.gameCenter;
    socket.join(data.roomid, () => {
      console.log("进入房间");
      sendMessage(PROTOCOL.RESPJOINROOM, { code: 0 });

      // 房间人数已满，开始游戏
      if (roomCenter.status == 1) {
        // 传入一些基础通信方法
        gameCenter.robotLeave = robotLeave;
        gameCenter.broadcast = broadcast;
        gameCenter.sendMessage = sendMessage;
        // 开始游戏初始化
        gameCenter.start();
        // 双方准备,通知开始游戏
        broadcast(PROTOCOL.RESPSTARTGAME, { code: 0 });
        // 发送地图数据,暂时只发送障碍物随机数据
        broadcast(PROTOCOL.RESPGAMEINFO, {
          barriers: gameCenter.map.barriers,
          userList: roomCenter.onlineList
        });
      }
    });
  });

  socket.on(PROTOCOL.REQACT, data => {
    // TODO: 这里应当做一些数据校验，暂时不写
    broadcast(PROTOCOL.RESPACT, {
      id: userInfo.id,
      data: data
    });
    gameCenter.act(userInfo.id, {
      speedX: data.speedX,
      speedY: data.speedY,
      x: data.x,
      y: data.y
    });
    if (data.type == 1) {
      // 一车已经到达终点
      gameCenter.finish();
      broadcast(PROTOCOL.RESPGAMEFINISHED, {
        winId: userInfo.id,
        code: 0
      });
    }
  });

  socket.on(PROTOCOL.REQCORRECT, data => {
    // 存储小车状态，当网络不稳定时进行校准
    let delay = gameCenter.store(userInfo.id, data);
    if (delay > 1000) {
      // 发送校验时间大于1S，对客户端返回服务端数据 进行校准
      let bothId = getBothId();
      sendMessage(PROTOCOL.RESPCORRECT, {
        dataSelf: gameCenter.data[bothId.idSelf],
        dataOpp: gameCenter.data[bothId.idOpp]
      });
    }
  });

  socket.on("disconnect", () => {
    // 断线退出游戏
    broadcast(PROTOCOL.RESPDISCONNECT, {
      code: 0,
      message: "对方已掉线"
    });
    roomCenter && roomCenter.leaveRoom && roomCenter.leaveRoom(userInfo.id);
    console.log("断开", userInfo.id, userInfo.roomid);
  });

  function getBothId() {
    let [idSelf, idOpp] = roomCenter.onlineList;
    if (idSelf != userInfo.id) {
      // 调转两id
      [idSelf, idOpp] = [idOpp, idSelf];
    }
    return { idSelf, idOpp };
  }
  function robotLeave() {
    console.log("机器人自动离开");

    broadcast(PROTOCOL.RESPDISCONNECT, {
      code: 0,
      message: "对方已掉线"
    });
    roomCenter && roomCenter.leaveRoom && roomCenter.leaveRoom(userInfo.id);
  }

  function broadcast(protocol, data) {
    socket.emit(protocol, data);
    socket.to(roomCenter.id).emit(protocol, data);
  }
  function sendMessage(protocol, data) {
    socket.emit(protocol, data);
  }
});
