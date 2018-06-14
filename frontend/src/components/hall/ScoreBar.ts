class ScoreBar extends egret.DisplayObjectContainer{
    private sType : Bitmap;
		private sCont : TextField;
		public set score (val : string){
			this.sCont.text = val;
		}
		public get score(){
			return this.sCont.text;
		}
    constructor(type:number){
        super();
        // type 0 : 縂得分 ； 1 ： 縂排名
				let src : string;
				type == 0 && (src = "pic_zdf_png");
				type == 1 && (src = "pic_zpm_png");

        this.sType = new Bitmap({
          source : src,
        })
				this.addChild(this.sType);

				this.sCont = new TextField({
					text: '123',
					size: 36,
					color:0xffe152,
					width: 130,
					height:36,
					textAlign: 'center',
					verticalAlign: 'middle',
				})
				
				this.sCont.x= 200;
				if(type == 0)
				this.sCont.x= 170;
				
				this.sCont.y = 3;
				this.addChild(this.sCont);

    }
}