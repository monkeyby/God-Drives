module.exports = {
  REQJOINROOM: 10000,
  RESPJOINROOM: 10001,

  // 简化流程，双方加入房间后开始游戏
  RESPSTARTGAME: 10013,

  // 返回barriers(障碍物信息)和userList(用于判断跑道)
  RESPGAMEINFO: 10033,

  // 返回winId 胜利者id
  RESPGAMEFINISHED: 10043,

  // 发送格式见dataAct
  REQACT: 10110,
  // 双方均收到广播id和data
  RESPACT: 10113,

  // 发送格式见dataHeart
  REQCORRECT: 10120,
  // 超时未发REQCORRECT时会收到校准信息，可暂不处理
  RESPCORRECT: 10123,

  RESPDISCONNECT: 12003
};

let dataHeart = {
  speedX: 0,
  speedY: 0,
  x: 0,
  y: 0
};

let dataAct = {
  // 运行标识，0正常行驶，1冲线到达重点
  type: 0,
  // x轴操作类型，0直行，1左，2右
  actX: 0,
  // y轴操作类型，-1减速，1加速
  actY: 0,
  // 为了进一步减少误差，在操作动作前做一次校准,上传下列操作动作时的状态标识
  speedX: 0,
  speedY: 0,
  x: 0,
  y: 0
};
