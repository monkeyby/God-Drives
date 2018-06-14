class Util {
  static formatFloat(num, len) {
    // var weishu = Math.pow(10,len)
    // console.log(weishu)
    // return   ( (Math.round(num*weishu))/weishu);;    
    var sNum = parseInt(num);
    return sNum.toFixed(len)
  }
  static parseClock(s) {
    let min = this.clockNum(Math.floor(s / 60));
    let sec = this.clockNum(s % 60);
    return `${min}:${sec}`
  }
  static clockNum(num) {
    return `00${num}`.slice(-2);
  }

  static RandomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
  }
}