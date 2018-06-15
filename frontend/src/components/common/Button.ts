/**
 * @
 * 游戏按钮，支持点下缩放效果
 * 可传配置对象或只传正常状态资源名字符串
 * 
 * 为便于伸缩效果，锚点居中，如需要伸缩效果，谨慎修改锚点位置
 */
interface ButtonConfig {
  width?: number;
  height?: number;
  default?: string; //正常状态资源名
  selected?: string; //触发状态资源名
  disabled?: string; //禁用状态资源名
  touchScale?: number; //开启触摸缩放,传入缩放倍率,默认为1,不开启
  x?: number;
  y?: number;
  index?: number;
  id?: string;
  textEnable?: boolean; // 开启这个状态，传入text资源名
  textDefault?: string;
  textSelected?: string;
}

class Button extends egret.Sprite {
  bg: Bitmap = new Bitmap('');
  private _index: number;
  private _id: string;
  private _text: Bitmap = new Bitmap('');
  private _textEnable: boolean;
  get id() {
    return this._id;
  }
  get index() {
    return this._index;
  }
  set texture(src) {
    let pic = src;
    if (typeof (src) == 'string') {
      pic = RES.getRes(src);
    }
    this.bg.texture = pic;
  }
  private _defaultRes: string = '';
  set defaultRes(res: string) {
    this._defaultRes = res;
    this.setStatus('default');
  }
  private _selectedRes: string = '';
  set selectedRes(res: string) {
    this._selectedRes = res;
  }
  private _disabledRes: string = '';
  set disabledRes(res: string) {
    this._disabledRes = res;
  }
  private touchScale: number = 1;
  private _status: string = 'default';
  set status(status) {
    this._status = status;
    this.setStatus(status);
  }
  get status() {
    return this._status;
  }
  private _textdefault: string = '';
  private _textselected: string = '';
  constructor(arg: ButtonConfig) {
    super();
    let self = this;
    this.addChild(this.bg);
    this.addChild(this._text);
    // 获取资源配置
    if (typeof (arg) == 'string') {
      self._defaultRes = arg;
      self.setStatus('default');
    } else {
      arg['textEnable'] && (self._textEnable = arg['textEnable'])
      arg['textDefault'] && (self._textdefault = arg['textDefault'])
      arg['textSelected'] && (self._textselected = arg['textSelected'])
      self._defaultRes = arg['default'] || '';
      self._selectedRes = arg['selected'] || '';
      self._disabledRes = arg['disabled'] || '';
      self.touchScale = arg['touchScale'] || 1;
      self.setStatus('default');
      self.width = arg.width || self.width;
      self.height = arg.height || self.height;
      self._index = arg['index'] || 0;
      self._id = arg['id'] || 'id';
    }
    // 设置锚点与偏移值
    self.anchorOffsetX = self.width / 2;
    self.anchorOffsetY = self.height / 2;
    self.x = self.width / 2;
    self.y = self.height / 2;
    arg.x && (self.x = arg.x);
    arg.y && (self.y = arg.y);
    // 绑定点击事件
    self.touchEnabled = true;
    self.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
      this.changeScale(self.touchScale);
    }, this);
    self.addEventListener(egret.TouchEvent.TOUCH_END, function () {
      this.changeScale(1);
    }, this);
    self.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
      this.changeScale(1);
    }, this);
  }

  private changeScale(scale) {
    egret.Tween.removeTweens(this);
    egret.Tween.get(this).to({
      scaleX: scale,
      scaleY: scale
    }, 50)
  }



  // 设置按钮状态(default||selected||disabled),返回当前状态
  public setStatus(status) {
    let self = this;
    switch (status) {
      case 'default': {
        self._defaultRes != '' && (this.bg.texture = RES.getRes(self._defaultRes));
        self.touchEnabled = true;

        break;
      }
      case 'selected': {
        self._selectedRes != '' && (this.bg.texture = RES.getRes(self._selectedRes));
        self.touchEnabled = true;
        break;
      }
      case 'disabled': {
        console.log(self._disabledRes, self._disabledRes != '')
        self._disabledRes != '' && (this.bg.texture = RES.getRes(self._disabledRes));
        self.touchEnabled = false;
        break;
      }
    }
    self._status = status;

    if (self._textEnable) {
      self[`_text${status}`] != '' && (this._text.texture = RES.getRes(self[`_text${status}`]))
      self._text.x = (self.width - self._text.width) / 2;
      self._text.y = (self.height - self._text.height) / 2;
    }
    return status;
  }
}