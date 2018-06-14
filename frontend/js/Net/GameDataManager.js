var GameDataManager = {
  winScore: 10,
  sio: '',
  gameType: 0,
  dataSelf: { nick: '我' },
  dataOpp: { nick: '玩家二' },
  score: '123',
  rank: 123,
  roomId: 0,
  offsetH: 0,
  robotId: null,
  // robotId: 10000,
  robotPlayCount: 0,
  lastRight: 0,

  userID: '',
  oppID: '',

  //chess
  selfColor: 0,
  oppColor: 0,
  oppIsRobot: false,


  bSelfNoPosition: false,
  bOppNoPosition: false,

  turnSetChess: 0,

  readyCount: 0,
  firstID: '',


  chessBoardW: 0,
  chessBoardH: 0,

  chessScale: 1,

  oppTid: 0,
  selfTid: 0,

  oppIsReady: false,
  mapData: [],
  recoredSoundType: true,

  lang: GetQueryString('lang'),
};
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2]; return null;
}