module.exports = {
  createRoom
};
function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
function createRoom(id) {
  let room = {
    robotLeave: null,
    broadcast: null,
    sendMessage: null,
    status: 0, //0等待，1游戏中
    id,
    onlineList: [], //存用户id
    leaveRoom(id) {
      removeByValue(this.onlineList, id);
      this.status = 0;
    },
    setOnline(id) {
      if (this.onlineList.indexOf(id) == -1) {
        this.onlineList.push(id);
        if (this.onlineList.length >= 2) {
          this.status = 1;
        }
        return true;
      } else {
        return false;
      }
    },
    // 游戏相关部分
    gameCenter: createGameData()
  };
  return room;
}
function createGameData() {
  let gameInfo = {
    map: {},
    data: {},
    lastStamp: 0,
    start() {
      this.map = createMap();
    },
    act(id, data) {
      // 有特殊事件发生也对数据进行保存
      this.data[id] = data;
    },
    store(id, data) {
      let oldStamp = this.lastStamp;
      this.lastStamp = new Date().getTime();
      let delay = 0;
      if (oldStamp) {
        delay = this.lastStamp - oldStamp;
      }
      this.data[id] = data;
      console.log(this.data);
      return delay;
    },
    finish() {
      this.dataOpp = {};
      this.dataSelf = {};
      this.lastStamp = 0;
      this.map = {};
    }
  };
  return gameInfo;
}

function createMap() {
  let map = {
    barriers: [],
    // 地图类型，扩展预留
    type: 0,
    // 总长度
    maxLen: 10000
  };
  let pieceBlank = 500;
  let pieceCount = Math.floor(map.maxLen / pieceBlank);
  for (let i = 0; i < pieceCount; i++) {
    map.barriers.push(
      randomBarrierBetween(i * pieceBlank, (i + 1) * pieceBlank)
    );
  }
  return map;
}
function randomBarrierBetween(y1, y2) {
  let barrier = {
    x: RandomNumBoth(0, 180 - 127),
    y: RandomNumBoth(y1, y2),
    type: RandomNumBoth(1, 11)
  };
  return barrier;
}
function RandomNumBoth(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}
