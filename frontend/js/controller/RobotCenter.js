// TypeScript file
var RobotCenter = {
    playcount: 0,
    init: function () {
        var self = this;
        EventManager.sub('RobotCenter/callToRobot', function () {
            console.log('机器人接收消息')
            var time = Math.random() * 500;
            var count = Math.floor(Math.random() * 4);
            if (count == 0)
                count = 1;
            setTimeout(function () {
                var isBackBrick = (Math.random());
                if (isBackBrick > 0.5) {
                    EventManager.pub('tiki/broadcastToAll', 'addBrick', { uid: GameDataManager.oppID, count: count });
                }
                console.log('机器人发送消息')
                self.playcount++;
                if (self.playcount > 15) {
                    var isLose = Math.floor(Math.random() * 15);
                    if (isLose == 1) {
                        EventManager.pub('tiki/broadcastToAll', 'gameover', { winId: GameDataManager.robotId });
                    }
                }
            }, time);
        })

        EventManager.sub('resetRobotData', function () {
            self.playcount = 0;
        })
    }

}
RobotCenter.init();