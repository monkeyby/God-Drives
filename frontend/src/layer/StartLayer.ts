class StartLayer extends egret.Sprite{
    
    btn_start : Button;

    btn_

    constructor(){
        super();

        this.width = UIConfig.stageW;
        this.height = UIConfig.stageH;


        let shape = new egret.Shape();
        shape.graphics.beginFill(0x000000,0.5);
        shape.graphics.drawRect(0,0,UIConfig.stageW,UIConfig.stageH);
        shape.graphics.endFill();
        this.addChild(shape);

        let title = new Bitmap({
            source:'startlayer-title_png',
            y:250 + UIConfig.offsetH
        })
        title.x = (UIConfig.stageW - title.width)/2;
        this.addChild(title);
        
        this.btn_start = new Button({
            default:'btn-sign-start_png',
            touchScale: .9
        })
        this.btn_start.y = 860 + UIConfig.offsetH;
        this.btn_start.x = (UIConfig.stageW - this.btn_start.width)/2;
        this.addChild(this.btn_start)

        let start_sign = new Bitmap({
            source:'btn-sign-start_png',
        })
        start_sign.x = (this.btn_start.width - start_sign.width)/2;
        start_sign.y = (this.btn_start.height - start_sign.height)/2;
        this.btn_start.addChild(start_sign);



    }
}