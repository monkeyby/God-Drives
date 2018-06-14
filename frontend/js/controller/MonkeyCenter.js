var MonkeyCenter = {
	branchesTatus: 0,//0 无 1 右 2 左
	treeLength: 67,
	climbTree: [
		1, 0, 1, 1,
		0, 1, 1, 1,
		1, 1, 0, 1,
	],
	init: function () {
		this.fListen();
	},
	mapDataInit: function () {
		var self = this;
		self.climbTree = [];
		for(var i =0 ; i< self.treeLength; i++){
			if(i == 0){
				this.climbTree.push(1);
			}else if(i == 1){
				this.climbTree.push(2);
			}else{
				var branches = Math.floor(Math.random() * 3);
				this.climbTree.push(branches);				
			}
		}
		return self.climbTree;
		// return self.climbTree = [1,2,1,2,1,2,1,2,1,2,1,2];
		
	},

	fListen: function () {
		var self = this;
	}
}
MonkeyCenter.init();