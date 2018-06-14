declare module GameDataManager {
  // 0非电话 1电话
  /**
   * 通用数据
   */
  var lang: string;

  var gameType: number;
  var dataSelf: Object;
  var dataOpp: Object;

  var score: number;
  var rank: number;

  var roomId: any;

  var userID: any;
  var oppID: any;
  var robotId: number;
  var robotPlayCount: number;
  var recoredSoundType: boolean;
  var lastRight: number;

  var selfColor: number;   // 1 黑子 2 白子
  var oppColor: number;

  var oppIsRobot: boolean;

  var chessBoardW: number;
  var chessBoardH: number;
  var chessScale: number;

  /**
   * 游戏内逻辑数据
   */

  //判断游戏结束
  var bSelfNoPosition: boolean;
  var bOppNoPosition: boolean;
  var turnSetChess: number;

  //判断谁先下棋、谁拿黑棋、是否开局

  var oppTid: number;
  var selfTid: number;

  var readyCount: number;
  var firstID: string;


  // houzi 
  var mapData: Array<number>;
  var oppIsReady: boolean;
}
