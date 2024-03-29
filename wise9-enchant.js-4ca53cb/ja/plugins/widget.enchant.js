/**
 * @fileOverview
 * widget.enchant.js
 * @version 0.2.0
 * @require enchant.js v0.6.0+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * enchant.jsでモバイル向けウェブページのようなUIを作成するためのライブラリ.
 */

(function() {

    /**
     * @type {Object}
     */
    enchant.widget = {
        assets: [
            'listItemBg.png',
            'iconMenuBg.png',
            'button.png',
            'buttonPushed.png',
            'dialog.png',
            'navigationBar.png'
        ],
        _env: {
            // default font
            font: '12px helvetica',
            buttonFont: '23px helvetica',
            navigationBarFont: '16px helvetica',
            textareaFont: '8px monospace',
            listItemMargin: 4,
            dialogMargin: 24,
            itemHeight: 48,
            buttonWidth: 64,
            buttonHeight: 36,
            dialogWidth: 300,
            dialogHeight: 225,
            inputMinHeight: 160,
            inputMaxHeight: 240,
            acceptName: 'OK',
            cancelName: 'NO',
            HOLDTIME: 300,
            DBLLIMIT: 300,
            FLINGVEL: 3
        },

        /**
         * 文字列やenchant.Surfaceなど単体で表示できないオブジェクトを表示できる形にして返す.
         * @param {*} content 表示させたいデータ.
         * @return {*} enchantのEntity系オブジェクト.
         */
        parseContent: function(content, font, color) {
            var en;
            if (typeof content === 'undefined') {
                content = '';
            }
            if (typeof content === 'number') {
                content = arguments.callee('' + content, font);
            } else if (content instanceof enchant.Entity) {
            } else if (content instanceof enchant.Surface) {
                en = new enchant.Sprite(content.width, content.height);
                en.image = content;
                content = en;
            } else if (typeof content == 'string') {
                calced = getElementMetrics(content, font);
                en = new enchant.Label(content);
                en.width = calced.width;
                en.height = calced.height;
                if (font) {
                    en.font = font;
                } else {
                    en.font = enchant.widget._env.font;
                }
                if (color) {
                    en.color = color;
                }
                content = en;
            }
            return content;
        }
    };

    /**
     * Sceneが開始したとき発生するイベント.
     * {@link enchant.Core#transitionPush}のアニメーションが終了した際に発生する.
     * @type {String}
     */
    enchant.Event.TRANSITIONENTER = 'transitionenter';

    /**
     * Sceneが終了したとき発生するイベント.
     * {@link enchant.Core#transitionPop}のアニメーションが終了した際に発生する.
     * @type {String}
     */
    enchant.Event.TRANSITIONEXIT = 'transitionexit';

    /**
     * enchant.widget.Confirmで肯定側のボタンが押されたときに発生されるイベント.
     * @type {String}
     */
    enchant.Event.ACCEPT = 'accept';

    /**
     * enchant.widget.Confirmで否定側のボタンが押されたときに発生されるイベント.
     * @type {String}
     */
    enchant.Event.CANCEL = 'cancel';

    /**
     * form系のオブジェクトで内容が変更されたときに発生されるイベント.
     * @type {String}
     */
    enchant.Event.CHANGE = 'change';

    /**
     * タップが検出されたときに発生されるイベント.
     * 移動なしでタッチが終了し, ダブルタップの判定時間が終了した場合検出される.
     * @type {String}
     */
    enchant.Event.TAP = 'tap';

    /**
     * ダブルタップが検出されたときに発生されるイベント.
     * 一定時間, 一定距離以内に2回タップが検出された場合検出される.
     * @type {String}
     */
    enchant.Event.DOUBLETAP = 'doubletap';

    /**
     * ホールドが検出されたときに発生されるイベント.
     * 移動なしで一定時間タッチが続いた場合検出される.
     * @type {String}
     */
    enchant.Event.HOLD = 'hold';

    /**
     * ドラッグが検出されたときに発生されるイベント.
     * ホールド中にタッチ位置が移動した際に検出される.
     * @type {String}
     */
    enchant.Event.DRAG = 'drag';

    /**
     * リリースが検出されたときに発生されるイベント.
     * ホールド中にタッチが終了した際に検出される.
     * @type {String}
     */
    enchant.Event.RELEASE = 'release';

    /**
     * スリップが検出されたときに発生されるイベント.
     * ホールドされずタッチ位置が移動した場合検出される.
     * @type {String}
     */
    enchant.Event.SLIP = 'slip';

    /**
     * フリックが検出されたときに発生されるイベント.
     * タッチが終了した際に, 一定速度以上で位置が移動していた場合検出される.
     * @type {String}
     */
    enchant.Event.FLING = 'fling';

    var NOTOUCH = 0;
    var WAITDBL = 1;
    var NOMOVE = 2;
    var NOMOVEDBL = 3;
    var MOVED = 4;
    var HOLD = 5;

    var getElementMetrics = function(string, font) {
        var e = document.createElement('div');
        var cvs = document.createElement('canvas');
        var ctx = cvs.getContext('2d');
        var arr, str, w;
        var width = 0;
        var height = 0;
        if (!font) {
            font = enchant.widget._env.font;
        }
        ctx.font = font;
        e.style.font = font;
        string = string || '';
        string = string.replace(/<(br|BR) ?\/?>/g, '<br>');
        arr = string.split('<br>');
        for (var i = 0, l = arr.length; i < l; i++) {
            str = arr[i];
            w = ctx.measureText(str).width;
            if (width < w) {
                width = w;
            }
        }

        e.innerHTML = string;

        if (document.body) {
            document.body.appendChild(e);
            height = parseInt(getComputedStyle(e).height, 10);
            e.style.position = 'absolute';
            width = parseInt(getComputedStyle(e).width, 10);
            document.body.removeChild(e);
        } else {
            height = 14 * arr.length;
        }

        return {
            width: width + 1,
            height: height + 1
        };
    };

    var calcLeastPosition = function(margin) {
        margin |= 0;
        return margin;
    };

    var calcMostPosition = function(child, parent, margin) {
        margin |= 0;
        return parent - margin - child;
    };

    var calcCenteredPosition = function(child, parent) {
        return ~~(parent / 2) - ~~(child / 2);
    };

    var getScaleOffest = function(length, scale) {
        var half = ~~(length / 2);
        scale = scale || 1;
        return half - ~~(half * scale);
    };

    var distribute = function(value, div) {
        if (typeof div == 'array') {
            var ratio = div;
            var ret = new Array(ratio.length);
            var retSum = 0;
            var maxi = 0;
            var max = 0;
            var sum = 0;
            var quo;

            ratio.forEach(function(n) {
                sum += n;
            });
            quo = value / sum;

            for (var i = 0, l = ret.length; i < l; i++) {
                ret[i] = Math.round(quo * ratio[i]);
                if (ratio[i] < max) {
                    maxi = i;
                    max = ratio[i];
                }
            }

            ret.forEach(function(n) {
                retSum += n;
            });

            ret[maxi] += value - retSum;
        } else if (typeof div == 'number') {
            var ret = new Array(div);
            var quo = ~~(value / div);
            var rem = ~~(value % div);
            for (var i = 0, l = div; i < l; i++) {
                ret[i] = quo;
            }
            for (var i = 0, l = rem; i < l; i++) {
                ret[i % div] += 1;
            }
        }
        return ret;
    };

    var Adjust = {
        fitToX: function(parent, margin) {
            var l = parent.width;
            var s = Math.min(
                (l - margin * 2) / this.width,
                (l - margin * 2) / this.height
            );
            if (this instanceof enchant.Sprite) {
                this.scaleX = s;
                this.scaleY = s;
            } else {
                this.width = ~~(this.width * s);
                this.height = ~~(this.height * s);
            }
        },
        fitToY: function(parent, margin) {
            var l = parent.height;
            var s = Math.min(
                (l - margin * 2) / this.width,
                (l - margin * 2) / this.height
            );
            if (this instanceof enchant.Sprite) {
                this.scaleX = s;
                this.scaleY = s;
            } else {
                this.width = ~~(this.width * s);
                this.height = ~~(this.height * s);
            }
        },
        fillX: function(parent, margin) {
            var s = (parent.width - margin * 2) / this.width;
            if (this instanceof enchant.Sprite) {
                this.scaleX = s;
                this.scaleY = s;
            } else {
                this.width = ~~(this.width * s);
                this.height = ~~(this.height * s);
            }
        },
        fillY: function(parent, margin) {
            var s = (parent.height - margin * 2) / this.height;
            if (this instanceof enchant.Sprite) {
                this.scaleX = s;
                this.scaleY = s;
            } else {
                this.width = ~~(this.width * s);
                this.height = ~~(this.height * s);
            }
        }
    };

    var Effect = {
        transitForwardIn: function(time) {
            var core = enchant.Core.instance;
            var child;
            this.x = core.width;
            var e = new enchant.Event(enchant.Event.RENDER);
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                child = this.childNodes[i];
                child.dispatchEvent(e);
            }
            this.tl
                .moveTo(0, 0, time, enchant.Easing.QUAD_EASEINOUT);
        },
        transitForwardOut: function(time) {
            var core = enchant.Core.instance;
            this.x = 0;
            this.tl
                .moveTo(-core.width, 0, time, enchant.Easing.QUAD_EASEINOUT);
        },
        transitBackIn: function(time) {
            var core = enchant.Core.instance;
            this.x = -core.width;
            this.tl
                .moveTo(0, 0, time, enchant.Easing.QUAD_EASEINOUT);
        },
        transitBackOut: function(time) {
            var core = enchant.Core.instance;
            this.x = 0;
            this.tl
                .moveTo(core.width, 0, time, enchant.Easing.QUAD_EASEINOUT);
        },
        popup: function() {
            this.scaleX = 0.1;
            this.scaleY = 0.1;
            this.opacity = 0.1;
            this.tl
                .fadeTo(0.8, 3, enchant.Easing.QUAD_EASEOUT)
                .and()
                .scaleTo(1, 3, enchant.Easing.BOUNCE_EASEOUT);
        },
        popdown: function() {
            this.tl
                .fadeTo(0.1, 3, enchant.Easing.QUAD_EASEOUT)
                .and()
                .scaleTo(0.1, 3, enchant.Easing.BOUNCE_EASEOUT);
        },
        resizeTo: function(width, height, time, easing) {
            return this.tl.tween({
                width: width,
                height: height,
                time: time,
                easing: easing
            });
        }
    };

    var Align = {

        /**
         * @scope enchant.Entity
         */

        /**
         * 指定オブジェクトの左側に寄せる.
         * @param {*} another 基準となるオブジェクト.
         * @param {Number} margin ずらすピクセル数.
         * @requires widget.enchant.js
         */
        alignLeftOf: function(another, margin) {
            margin |= 0;
            var anotherScaleOffset = getScaleOffest(another.width, another.scaleX);
            var scaleOffset = getScaleOffest(this.width, this.scaleX);
            this.x = another.x + anotherScaleOffset - scaleOffset - this.width - margin;
            return this;
        },
        /**
         * 指定オブジェクトの右側に寄せる.
         * @param {*} another 基準となるオブジェクト.
         * @param {Number} margin ずらすピクセル数.
         * @requires widget.enchant.js
         */
        alignRightOf: function(another, margin) {
            margin |= 0;
            var anotherScaleOffset = getScaleOffest(another.width, another.scaleX);
            var scaleOffset = getScaleOffest(this.width, this.scaleX);
            this.x = another.x + another.width - anotherScaleOffset - scaleOffset + margin;
            return this;
        },
        /**
         * 指定オブジェクトの上側に寄せる.
         * @param {*} another 基準となるオブジェクト.
         * @param {Number} margin ずらすピクセル数.
         * @requires widget.enchant.js
         */
        alignTopOf: function(another, margin) {
            margin |= 0;
            var anotherScaleOffset = getScaleOffest(another.height, another.scaleY);
            var scaleOffset = getScaleOffest(this.height, this.scaleY);
            this.y = another.y + anotherScaleOffset - scaleOffset - this.height - margin;
            return this;
        },
        /**
         * 指定オブジェクトの下側に寄せる.
         * @param {*} another 基準となるオブジェクト.
         * @param {Number} margin ずらすピクセル数.
         * @requires widget.enchant.js
         */
        alignBottomOf: function(another, margin) {
            margin |= 0;
            var anotherScaleOffset = getScaleOffest(another.height, another.scaleY);
            var scaleOffset = getScaleOffest(this.height, this.scaleY);
            this.y = another.y + another.height - anotherScaleOffset - scaleOffset + margin;
            return this;
        },
        /**
         * 指定オブジェクト内で左寄せを行う.
         * @param {*} another 基準となるオブジェクト.
         * @param {Number} margin ずらすピクセル数.
         * @requires widget.enchant.js
         */
        alignLeftIn: function(another, margin) {
            var scaleOffset = getScaleOffest(this.width, this.scaleX);
            this.x = calcLeastPosition(margin) - scaleOffset;
            return this;
        },
        /**
         * 指定オブジェクト内で右寄せを行う.
         * @param {*} another 基準となるオブジェクト.
         * @param {Number} margin ずらすピクセル数.
         * @requires widget.enchant.js
         */
        alignRightIn: function(another, margin) {
            var scaleOffset = getScaleOffest(this.width, this.scaleX);
            this.x = calcMostPosition(this.width, another.width, margin) + scaleOffset;
            return this;
        },
        /**
         * 指定オブジェクト内で上寄せを行う.
         * @param {*} another 基準となるオブジェクト.
         * @param {Number} margin ずらすピクセル数.
         * @requires widget.enchant.js
         */
        alignTopIn: function(another, margin) {
            var scaleOffset = getScaleOffest(this.height, this.scaleY);
            this.y = calcLeastPosition(margin) - scaleOffset;
            return this;
        },
        /**
         * 指定オブジェクト内で下寄せを行う.
         * @param {*} another 基準となるオブジェクト.
         * @param {Number} margin ずらすピクセル数.
         * @requires widget.enchant.js
         */
        alignBottomIn: function(another, margin) {
            var scaleOffset = getScaleOffest(this.height, this.scaleY);
            this.y = calcMostPosition(this.height, another.height, margin) + scaleOffset;
            return this;
        },
        /**
         * 指定オブジェクト内でx方向の中央寄せを行う.
         * @param {*} another 基準となるオブジェクト.
         * @param {Number} margin ずらすピクセル数.
         * @requires widget.enchant.js
         */
        alignHorizontalCenterIn: function(another) {
            this.x = calcCenteredPosition(this.width, another.width);
            return this;
        },
        /**
         * 指定オブジェクト内でy方向の中央寄せを行う.
         * @param {*} another 基準となるオブジェクト.
         * @param {Number} margin ずらすピクセル数.
         * @requires widget.enchant.js
         */
        alignVerticalCenterIn: function(another) {
            this.y = calcCenteredPosition(this.height, another.height);
            return this;
        }
    };

    for (var prop in Align) {
        enchant.Entity.prototype[prop] = Align[prop];
    }

    var _transitionLock = false;

    /**
     * @scope enchant.Core
     */

    /**
     * トランジションアニメーションのついたpushSceneを行う.
     * @param {enchant.Scene} scene 移行する新しいシーン.
     * @return {enchant.Scene} 新しいシーン.
     * @requires widget.enchant.js
     */
    enchant.Core.prototype.transitionPush = function(inScene) {
        if (_transitionLock) return null;
        _transitionLock = true;
        var time = 15;
        var c = 0;
        var outScene = this.currentScene;
        Effect.transitForwardIn.call(inScene, time);
        Effect.transitForwardOut.call(outScene, time);
        this.addEventListener(enchant.Event.ENTER_FRAME, function(e) {
            outScene.dispatchEvent(e);
            if (c > time) {
                _transitionLock = false;
                this.removeEventListener(enchant.Event.ENTER_FRAME, arguments.callee);
                inScene.dispatchEvent(new enchant.Event(enchant.Event.TRANSITIONENTER));
                outScene.dispatchEvent(new enchant.Event(enchant.Event.TRANSITIONEXIT));
            }
            c++;
        });
        return this.pushScene(inScene);
    };

    /**
     * トランジションアニメーションのついたpopSceneを行う.
     * @return {enchant.Scene} 終了させたシーン.
     * @requires widget.enchant.js
     */
    enchant.Core.prototype.transitionPop = function() {
        if (_transitionLock) return null;
        if (this.currentScene == this.rootScene) return null;
        _transitionLock = true;
        var time = 15;
        var c = 0;
        var outScene = this.currentScene;
        var inScene = this._scenes[this._scenes.length - 2];
        this.addEventListener(enchant.Event.ENTER_FRAME, function(e) {
            inScene.dispatchEvent(e);
            if (c > time) {
                _transitionLock = false;
                this.removeEventListener(enchant.Event.ENTER_FRAME, arguments.callee);
                this.popScene();
                outScene.dispatchEvent(new enchant.Event(enchant.Event.TRANSITIONEXIT));
                inScene.dispatchEvent(new enchant.Event(enchant.Event.TRANSITIONENTER));
            }
            c++;
        });
        Effect.transitBackIn.call(inScene, time);
        Effect.transitBackOut.call(outScene, time);
        return this._scenes[this._scenes.length - 1];
    };

    /**
     * @scope enchant.widget.GestureDetector
     */
    enchant.widget.GestureDetector = enchant.Class.create(enchant.EventTarget, {
        /**
         * タッチ入力の動きから幾つかのジェスチャーを検出してイベントを発行する.
         * タップ, ダブルタップ, ホールド, ドラッグ, フリックなどを検出することができる.
         * @param {enchant.Entity} target 入力を検出させたいオブジェクト.
         * @constructs
         * @extends enchant.EventTarget
         */
        initialize: function(target) {
            var core = enchant.Core.instance;
            enchant.EventTarget.call(this);
            this._target;
            this._startX = 0;
            this._startY = 0;
            this._lastX = 0;
            this._lastY = 0;
            this._touchElapsed = 0;
            this._releaseElapsed = 0;
            this._state = NOTOUCH;
            this._velobase = (core.width > core.height) ? core.height : core.width;

            var detector = this;
            this._handler = function(e) {
                detector.dispatchEvent(e);
            };

            this._types = [
                enchant.Event.TOUCH_START,
                enchant.Event.TOUCH_MOVE,
                enchant.Event.TOUCH_END,
                enchant.Event.ENTER_FRAME
            ];

            if (target) {
                this.attach(target);
            }
        },
        attach: function(target) {
            this._target = target;
            this._types.forEach(function(event) {
                this._target.addEventListener(event, this._handler);
            }, this);
        },
        detach: function() {
            this._types.forEach(function(event) {
                this._target.removeEventListener(event, this._handler);
            }, this);
            this._target = null;
        },
        ontouchstart: function(e) {
            var core = enchant.Core.instance;
            this._startFrame = core.frame;
            this._startX = this._lastX = e.x;
            this._startY = this._lastY = e.y;
            if (this._state == WAITDBL) {
                this._state = NOMOVEDBL;
            } else if (this._state == NOTOUCH) {
                this._state = NOMOVE;
            }
        },
        ontouchmove: function(e) {
            var dx = e.x - this._lastX;
            var dy = e.y - this._lastY;
            this._lastX = e.x;
            this._lastY = e.y;
            switch (this._state) {
                case NOMOVE:
                case NOMOVEDBL:
                    this._state = MOVED;
                case MOVED:
                    var evt = new enchant.Event(enchant.Event.SLIP);
                    evt.x = this._lastX;
                    evt.y = this._lastY;
                    evt.dx = dx;
                    evt.dy = dy;
                    this._target.dispatchEvent(evt);
                    break;
                case HOLD:
                    var evt = new enchant.Event(enchant.Event.DRAG);
                    evt.x = this._lastX;
                    evt.y = this._lastY;
                    evt.dx = dx;
                    evt.dy = dy;
                    this._target.dispatchEvent(evt);
                    break;
                default:
                    break;
            }
        },
        ontouchend: function(e) {
            var core = enchant.Core.instance;
            switch (this._state) {
                case MOVED:
                    velocityX = (this._lastX - this._startX) / this._velobase / this._touchElapsed * 1000;
                    velocityY = (this._lastY - this._startY) / this._velobase / this._touchElapsed * 1000;
                    if (velocityX > enchant.widget._env.FLINGVEL || velocityY > enchant.widget._env.FLINGVEL) {
                        var evt = new enchant.Event(enchant.Event.FLING);
                        evt.x = this._startX;
                        evt.y = this._startY;
                        evt.ex = this._lastX;
                        evt.ey = this._lastY;
                        evt.velocityX = velocityX;
                        evt.velocityY = velocityY;
                        this._target.dispatchEvent(evt);
                    }
                    this._state = NOTOUCH;
                    break;
                case HOLD:
                    var evt = new enchant.Event(enchant.Event.RELEASE);
                    evt.x = this._lastX;
                    evt.y = this._lastY;
                    this._target.dispatchEvent(evt);
                    this._state = NOTOUCH;
                    break;
                case NOMOVEDBL:
                    var evt = new enchant.Event(enchant.Event.DOUBLETAP);
                    evt.x = this._lastX;
                    evt.y = this._lastY;
                    this._target.dispatchEvent(evt);
                    this._state = NOTOUCH;
                    this._releaseElapsed = 0;
                    break;
                case NOMOVE:
                    this._state = WAITDBL;
                    break;
                default:
                    this._state = NOTOUCH;
                    break;
            }
            this._touchElapsed = 0;
            this._startX = 0;
            this._startY = 0;
        },
        onenterframe: function(e) {
            var elapsed = e.elapsed;
            switch (this._state) {
                case WAITDBL:
                    this._releaseElapsed += elapsed;
                    if (this._releaseElapsed >= enchant.widget._env.DBLLIMIT) {
                        var evt = new enchant.Event(enchant.Event.TAP);
                        evt.x = this._lastX;
                        evt.y = this._lastY;
                        this._lastX = 0;
                        this._lastY = 0;
                        this._target.dispatchEvent(evt);
                        this._state = NOTOUCH;
                        this._releaseElapsed = 0;
                    }
                    break;
                case NOMOVEDBL:
                    this._releaseElapsed += elapsed;
                    if (this._releaseElapsed >= enchant.widget._env.DBLLIMIT) {
                        this._state = NOMOVE;
                        this._releaseElapsed = 0;
                    }
                case NOMOVE:
                    this._touchElapsed += elapsed;
                    if (this._touchElapsed >= enchant.widget._env.HOLDTIME) {
                        var evt = new enchant.Event(enchant.Event.HOLD);
                        evt.x = this._lastX;
                        evt.y = this._lastY;
                        this._target.dispatchEvent(evt);
                        this._state = HOLD;
                        this._touchElapsed = 0;
                    }
                    break;
                case MOVED:
                    this._touchElapsed += elapsed;
                    break;
                case NOTOUCH:
                case HOLD:
                default:
                    break;
            }
        }
    });
    enchant.widget.GestureDetector.gestureEvents = [
        enchant.Event.ACCEPT,
        enchant.Event.CANCEL,
        enchant.Event.TAP,
        enchant.Event.DOUBLETAP,
        enchant.Event.HOLD,
        enchant.Event.DRAG,
        enchant.Event.RELEASE,
        enchant.Event.SLIP,
        enchant.Event.FLING
    ];

    /**
     * @scope enchant.widget.Ninepatch
     */
    enchant.widget.Ninepatch = enchant.Class.create(enchant.Surface, {
        /**
         * 9patchに対応したサーフェース.
         * コンテンツ領域の設定には対応していない.
         * @param {Number} width Surfaceの横幅.
         * @param {Number} height Surfaceの高さ.
         * @constructs
         * @extends enchant.Surface
         */
        initialize: function(width, height) {
            enchant.Surface.call(this, width, height);

            this._horScStore = [];
            this._horNoScStore = [];
            this._verScStore = [];
            this._verNoScStore = [];
            this._src;
        },
        /**
         * 9patchのソース.
         * @type {enchant.Surface}
         */
        src: {
            get: function() {
                return this._src;
            },
            set: function(surface) {
                if (surface == this._src || !(surface instanceof enchant.Surface)) {
                    return;
                }
                this._slicedraw(surface);
                this._src = surface;
            }
        },
        _detect: function(img) {
            this._horScStore = [];
            this._horNoScStore = [];
            this._verScStore = [];
            this._verNoScStore = [];
            var elem = img._element;
            var cvs = document.createElement('canvas');
            var width = cvs.width = img.width;
            var height = cvs.height = img.height;
            var ctx = cvs.getContext('2d');
            ctx.drawImage(elem, 0, 0, width, height);
            var pixels = ctx.getImageData(0, 0, width, height);

            var isBlack = function(i) {
                return pixels.data[i] == 0 && pixels.data[i + 1] == 0 && pixels.data[i + 2] == 0 && pixels.data[i + 3] == 255;
            };

            var last = false;
            var tmp = [];
            var scalable = [];
            var noscalable = [];

            for (var i = 1, l = width - 1; i < l; i++) {
                last = isBlack(i * 4);
                if (last) {
                    if (scalable.length == 0) {
                        scalable.push(i);
                    }
                    if (noscalable.length == 1) {
                        noscalable.push(i - 1);
                        this._horNoScStore.push(noscalable);
                        noscalable = [];
                    }
                } else {
                    if (noscalable.length == 0) {
                        noscalable.push(i);
                    }
                    if (scalable.length == 1) {
                        scalable.push(i - 1);
                        this._horScStore.push(scalable);
                        scalable = [];
                    }
                }
            }
            if (scalable.length == 1) {
                scalable.push(i - 1);
                this._horScStore.push(scalable);
            }
            if (noscalable.length == 1) {
                noscalable.push(i - 1);
                this._horNoScStore.push(noscalable);
            }
            scalable = [];
            noscalable = [];

            for (var i = 1, l = height - 1; i < l; i++) {
                last = isBlack(i * width * 4);
                if (last) {
                    if (scalable.length == 0) {
                        scalable.push(i);
                    }
                    if (noscalable.length == 1) {
                        noscalable.push(i - 1);
                        this._verNoScStore.push(noscalable);
                        noscalable = [];
                    }
                } else {
                    if (noscalable.length == 0) {
                        noscalable.push(i);
                    }
                    if (scalable.length == 1) {
                        scalable.push(i - 1);
                        this._verScStore.push(scalable);
                        scalable = [];
                    }
                }
            }
            if (scalable.length == 1) {
                scalable.push(i - 1);
                this._verScStore.push(scalable);
            }
            if (noscalable.length == 1) {
                noscalable.push(i - 1);
                this._verNoScStore.push(noscalable);
            }
        },
        _slicedraw: function(img) {
            this._detect(img);
            var elem = img._element;
            var w = img.width;
            var h = img.height;
            var width = this.width;
            var height = this.height;
            var ctx = this.context;

            var getSum = function(store) {
                var s;
                var sum = 0;
                for (var i = 0, l = store.length; i < l; i++) {
                    s = store[i];
                    sum += s[1] - s[0] + 1;
                }
                return sum;
            };
            var getRatio = function(array) {
                var a, ret = [];
                for (var i = 0, l = array.length; i < l; i++) {
                    a = array[i];
                    ret.push(a[1] - a[0] + 1);
                }
                return ret;
            };
            var fix = function(array, fix) {
                var a;
                for (var i = 0, l = array.length; i < l; i++) {
                    a = array[i];
                    a.fix = fix[i];
                }
            };
            var distribute = function(value, ratio) {
                var ret = new Array(ratio.length);
                var retSum = 0;
                var maxi = 0;
                var max = 0;
                var sum = 0;
                var quo;

                ratio.forEach(function(n) {
                    sum += n;
                });
                quo = value / sum;

                for (var i = 0, l = ret.length; i < l; i++) {
                    ret[i] = Math.round(quo * ratio[i]);
                    if (ratio[i] < max) {
                        maxi = i;
                        max = ratio[i];
                    }
                }

                ret.forEach(function(n) {
                    retSum += n;
                });

                ret[maxi] += value - retSum;

                return ret;
            };

            var ratioH = getRatio(this._horScStore);
            var valueH = width - getSum(this._horNoScStore);
            var scaledW = distribute(valueH, ratioH);

            var ratioV = getRatio(this._verScStore);
            var valueV = height - getSum(this._verNoScStore);
            var scaledH = distribute(valueV, ratioV);

            fix(this._horScStore, scaledW);
            fix(this._verScStore, scaledH);

            var verQueue = this._verScStore.concat(this._verNoScStore).sort(function(a, b) {
                return a[0] - b[0];
            });
            var horQueue = this._horScStore.concat(this._horNoScStore).sort(function(a, b) {
                return a[0] - b[0];
            });

            var verQ;
            var horQ;
            var sx, sy, sw, sh, dw, dh;
            var dx = 0;
            var dy = 0;

            ctx.clearRect(0, 0, this.width, this.height);
            for (var i = 0, l = horQueue.length; i < l; i++) {
                horQ = horQueue[i];
                sx = horQ[0];
                sw = horQ[1] - horQ[0] + 1;
                dw = (typeof horQ.fix == 'number') ? horQ.fix : sw;
                dy = 0;
                for (var j = 0, ll = verQueue.length; j < ll; j++) {
                    verQ = verQueue[j];
                    sy = verQ[0];
                    sh = verQ[1] - verQ[0] + 1;
                    dh = (typeof verQ.fix == 'number') ? verQ.fix : sh;
                    ctx.drawImage(elem, sx, sy, sw, sh, dx, dy, dw, dh);
                    dy += dh;
                }
                dx += dw;
            }
        },
        /**
         * @type {Number}
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                if (this._element) {
                    this._element.width = width;
                }
                if (this._src instanceof enchant.Surface) {
                    this._slicedraw(this._src);
                }
            }
        },
        /**
         * @type {Number}
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                if (this._element) {
                    this._element.height = height;
                }
                if (this._src instanceof enchant.Surface) {
                    this._slicedraw(this._src);
                }
            }
        },
        /**
         * 指定したサイズで作りなおす.
         * @param {Number} width 新しい横幅.
         * @param {Number} height 新しい高さ.
         */
        resize: function(width, height) {
            this._width = width;
            this._height = height;
            this._element.width = width;
            this._element.height = height;
            if (this._src instanceof enchant.Surface) {
                this._slicedraw(this._src);
            }
        }
    });

    /**
     * @scope enchant.widget.EntityGroup
     */
    enchant.widget.EntityGroup = enchant.Class.create(enchant.Entity, {
        /**
         * 子を持つことができるEntity.
         * @param {Number} width Entityの横幅.
         * @param {Number} height Entityの高さ.
         * @constructs
         * @extends enchant.Entity
         */
        initialize: function(width, height) {
            enchant.Entity.call(this);
            this._background;
            this.width = width;
            this.height = height;
            this.childNodes = [];

            [ enchant.Event.ADDED_TO_SCENE, enchant.Event.REMOVED_FROM_SCENE ]
                .forEach(function(event) {
                    this.addEventListener(event, function(e) {
                        this.childNodes.slice().forEach(function(child) {
                            child.scene = this.scene;
                            child.dispatchEvent(e);
                        }, this);
                    });
                }, this);
        },
        /**
         * @type {Number}
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._dirty = true;
                if (this.background instanceof enchant.widget.Ninepatch) {
                    this.background.width = this.width;
                }
            }
        },
        /**
         * @type {Number}
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._dirty = true;
                if (this.background instanceof enchant.widget.Ninepatch) {
                    this.background.height = this.height;
                }
            }
        },
        /**
         * 背景として使用するSurface.
         * @type {enchant.Surface}
         */
        background: {
            get: function() {
                return this._background;
            },
            set: function(surface) {
                if (surface instanceof enchant.Surface) {
                    this._background = surface;
                    if (surface._css) {
                        this._style['background-image'] = surface._css;
                    }
                }
            }
        },
        /**
         * EntityGroupにNodeを追加する.
         * @param {enchant.Node} child 追加するNode.
         */
        addChild: enchant.Group.prototype.addChild,
        /**
         * EntityGroupにNodeを挿入する.
         * @param {enchant.Node} child 挿入するNode.
         * @param {enchant.Node} reference 挿入位置の前にあるNode.
         */
        insertBefore: enchant.Group.prototype.insertBefore,
        /**
         * EntityGroupからNodeを削除する.
         * @param {enchant.Node} child 削除するNode.
         */
        removeChild: enchant.Group.prototype.removeChild,
        /**
         * 最初の子Node.
         */
        firstChild: Object.getOwnPropertyDescriptor(enchant.Group.prototype, 'firstChild'),
        /**
         * 最後の子Node.
         * @type {enchant.Node}
         */
        lastChild: Object.getOwnPropertyDescriptor(enchant.Group.prototype, 'lastChild'),
        _dirty: Object.getOwnPropertyDescriptor(enchant.Group.prototype, '_dirty'),
        cvsRender: function(ctx) {
            if (this.background &&
                this.background._element.width > 0 &&
                this.background._element.height > 0) {
                ctx.drawImage(this.background._element, 0, 0, this.width, this.height);
            }
        }
    });

    /**
     * @scope enchant.widget.Modal
     */
    enchant.widget.Modal = enchant.Class.create(enchant.Scene, {
        /**
         * モーダルシーン.
         * @constructs
         * @extends enchant.Scene
         */
        initialize: function() {
            enchant.Scene.call(this);
            var core = enchant.Core.instance;
            var shade = new enchant.Sprite(core.width, core.height);
            shade.backgroundColor = 'rgba(0, 0, 0, 255, 0.1)';
            this.addChild(shade);
            this.addEventListener(enchant.Event.ENTER, function() {
                shade.tl.fadeTo(0.7, 5, enchant.Easing.QUAD_EASEOUT);
            });
        }
    });

    /**
     * @scope enchant.widget.Button.prototype
     */
    enchant.widget.Button = enchant.Class.create(enchant.widget.EntityGroup, {
        /**
         * ボタン.
         * 通常の背景と押下中の背景を設定できる.
         * @param {*} content ボタンの内容.
         * @constructs
         * @extends enchant.widget.EntityGroup
         */
        initialize: function(content) {
            var core = enchant.Core.instance;
            content = content || '';
            var minwidth = enchant.widget._env.buttonWidth;
            var minheight = enchant.widget._env.buttonHeight;
            enchant.widget.EntityGroup.call(this, minwidth, minheight);
            this._image;
            this._pushedimage;
            this._content;
            this._rawContent;
            var bg1 = new enchant.widget.Ninepatch(minwidth, minheight);
            bg1.src = core.assets['button.png'];
            this.image = bg1;

            var bg2 = new enchant.widget.Ninepatch(minwidth, minheight);
            bg2.src = core.assets['buttonPushed.png'];
            this.pushedimage = bg2;

            this.content = content;
            this.width = Math.max(this._content.width, minwidth);
            this.height = Math.max(this._content.height, minheight);
            this.addEventListener(enchant.Event.TOUCH_START, function() {
                if (!this._pushedimage) {
                    return;
                }
                this.background = this._pushedimage;
            });
            this.addEventListener(enchant.Event.TOUCH_END, function() {
                if (!this._pushedimage) {
                    return;
                }
                this.background = this._image;
            });
        },
        refresh: function() {
            if (this._content) {
                this._content.alignHorizontalCenterIn(this).alignVerticalCenterIn(this);
            }
        },
        /**
         * ボタンの幅
         * @type number
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._style.width = (this._width = width) + 'px';
                if (this._image instanceof enchant.widget.Ninepatch) {
                    this._image.width = width;
                }
                if (this._pushedimage instanceof enchant.widget.Ninepatch) {
                    this._pushedimage.width = width;
                }
                this.refresh();
            }
        },
        /**
         * ボタンの高さ
         * @type number
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._style.height = (this._height = height) + 'px';
                if (this._image instanceof enchant.widget.Ninepatch) {
                    this._image.height = height;
                }
                if (this._pushedimage instanceof enchant.widget.Ninepatch) {
                    this._pushedimage.height = height;
                }
                this.refresh();
            }
        },
        /**
         * ボタンの背景.
         */
        image: {
            get: function() {
                return this._image;
            },
            set: function(image) {
                if (image == this._image) {
                    return;
                }
                this.background = image;
                this._image = image;
            }
        },
        /**
         * ボタンが押されている時の背景.
         * @type {enchant.Surface}
         */
        pushedimage: {
            get: function() {
                return this._pushedimage;
            },
            set: function(image) {
                if (image == this._pushedimage) {
                    return;
                }
                this._pushedimage = image;
            }
        },
        /**
         * ボタンの内容
         * @type {String}
         */
        content: {
            get: function() {
                return this._rawContent;
            },
            set: function(content) {
                this._rawContent = content;
                var font = enchant.widget._env.buttonFont;
                content = enchant.widget.parseContent(content, font);
                if (this._content) {
                    this.removeChild(this._content);
                }
                this.addChild(content);
                this._content = content;
                this.refresh();
            }
        }
    });

    /**
     * @scope enchant.widget.Alert
     */
    enchant.widget.Alert = enchant.Class.create(enchant.widget.EntityGroup, {
        /**
         * アラートダイアログ.
         * 通常{@link enchant.widget.AlertScene}から使用する.
         * @param {*} content 表示するコンテンツ.
         * @param {String} ac 了承ボタンのラベル.
         * @see enchant.widget.AlertScene
         * @constructs
         * @extends enchant.widget.EntityGroup
         */
        initialize: function(content, ac) {
            var core = enchant.Core.instance;
            var dialogwidth = enchant.widget._env.dialogWidth;
            var dialogheight = enchant.widget._env.dialogHeight;
            enchant.widget.EntityGroup.call(this, dialogwidth, dialogheight);
            var margin = enchant.widget._env.dialogMargin;

            content = enchant.widget.parseContent(content);
            content.alignHorizontalCenterIn(this).alignTopIn(this, margin);

            var accept = new enchant.widget.Button(ac);
            accept.alignHorizontalCenterIn(this).alignBottomIn(this, margin);

            var that = this;
            accept.addEventListener(enchant.Event.TOUCH_END, function() {
                that.dispatchEvent(new enchant.Event(enchant.Event.ACCEPT));
            });

            var np = new enchant.widget.Ninepatch(this.width, this.height);
            np.src = core.assets['dialog.png'];
            this.background = np;

            this._content = content;
            this._accept = accept;

            this.addChild(content);
            this.addChild(accept);
        },
        /**
         * 了承ボタンが押されたときに実行される関数.
         * @type {Function}
         */
        onaccept: function() {
        }
    });

    /**
     * @scope enchant.widget.Confirm
     */
    enchant.widget.Confirm = enchant.Class.create(enchant.widget.EntityGroup, {
        /**
         * コンファームダイアログ.
         * 通常{@link enchant.widget.ConfirmScene}から使用する.
         * @param {*} content 表示するコンテンツ.
         * @param {String} ac 了承ボタンのラベル.
         * @param {String} ig キャンセルボタンのラベル.
         * @see enchant.widget.ConfirmScene
         * @constructs
         * @extends enchant.widget.EntityGroup
         */
        initialize: function(content, ac, ig) {
            var core = enchant.Core.instance;
            var dialogwidth = enchant.widget._env.dialogWidth;
            var dialogheight = enchant.widget._env.dialogHeight;
            enchant.widget.EntityGroup.call(this, dialogwidth, dialogheight);
            var margin = enchant.widget._env.dialogMargin;

            var content = enchant.widget.parseContent(content);
            content.alignHorizontalCenterIn(this).alignTopIn(this, margin);

            var cancel = new enchant.widget.Button(ig);
            cancel.alignLeftIn(this, margin).alignBottomIn(this, margin);

            var accept = new enchant.widget.Button(ac);
            accept.alignRightIn(this, margin).alignBottomIn(this, margin);

            var that = this;
            cancel.addEventListener(enchant.Event.TOUCH_END, function() {
                that.dispatchEvent(new enchant.Event(enchant.Event.CANCEL));
            });
            accept.addEventListener(enchant.Event.TOUCH_END, function() {
                that.dispatchEvent(new enchant.Event(enchant.Event.ACCEPT));
            });

            var np = new enchant.widget.Ninepatch(this.width, this.height);
            np.src = core.assets['dialog.png'];
            this.background = np;

            this._content = content;
            this._cancel = cancel;
            this._accept = accept;

            this.addChild(content);
            this.addChild(cancel);
            this.addChild(accept);
        },
        /**
         * キャンセルボタンが押されたときに実行される関数.
         * @type {Function}
         */
        oncancel: function() {
        },
        /**
         * 了承ボタンが押されたときに実行される関数.
         */
        onaccept: function() {
        }
    });

    /**
     * @scope enchant.widget.Prompt
     */
    enchant.widget.Prompt = enchant.Class.create(enchant.widget.Confirm, {
        /**
         * プロンプトダイアログ.
         * 通常{@link enchant.widget.PromptScene}から使用する.
         * @param {*} content 表示するコンテンツ.
         * @param {String} ac 了承ボタンのラベル.
         * @param {String} ig キャンセルボタンのラベル.
         * @see enchant.widget.PromptScene
         * @constructs
         * @extends enchant.widget.Confirm
         */
        initialize: function(content, ac, ig, placeholder) {
            enchant.widget.Confirm.call(this, content, ac, ig);
            var margin = enchant.widget._env.dialogMargin;
            var input = this._input = new enchant.widget.InputTextBox();
            input.width = this.width / 4 * 3;
            input.placeholder = placeholder;
            input.alignHorizontalCenterIn(this).alignBottomOf(this._content, margin);
            this.addChild(input);
        },
        /**
         * content of prompt.
         */
        value: {
            get: function() {
                return this._input.value;
            },
            set: function(value) {
                this._input.value = value;
            }
        }
    });

    /**
     * @scope enchant.widget.Input
     */
    enchant.widget.Input = enchant.Class.create(enchant.Entity, {
        /**
         * <input>を内包したEntity.
         * @param {String} type <input>のtype.
         * @constructs
         * @extends enchant.Entity
         */
        initialize: function(type) {
            enchant.Entity.call(this);
            if (!type) {
                type = 'input';
            }
            var that = this;
            this._input = document.createElement(type);

            this._input.addEventListener('change', function(e) {
                that.dispatchEvent(new enchant.Event(enchant.Event.CHANGE));
            });

            this._element = document.createElement('div');
            this._element.appendChild(this._input);
        },
        /**
         * 入力を許可するか決定する.
         * @type {Boolean}
         */
        disabled: {
            get: function() {
                return this._input.disbaled;
            },
            set: function(value) {
                this._input.disabled = !!value;
            }
        }
    });

    /**
     * @scope enchant.widget.InputTextBox
     */
    enchant.widget.InputTextBox = enchant.Class.create(enchant.widget.Input, {
        /**
         * テキストボックス.
         * @constructs
         * @extends enchant.widget.Input
         */
        initialize: function() {
            enchant.widget.Input.call(this);
            this._input.type = 'text';

            var metrics = getElementMetrics(this._element.innerHTML);
            this.width = metrics.width;
            this.height = metrics.height;

            var that = this;
            this._focused = false;

            this._input.addEventListener('focus', function() {
                that._focused = true;
            });

            this._input.addEventListener('blur', function() {
                that._focused = false;
            });
        },
        /**
         * @type {Number}
         */
        selectionStart: {
            get: function() {
                return this._input.selectionStart;
            },
            set: function(n) {
                this._input.selectionStart = n;
            }
        },
        /**
         * @type {Number}
         */
        selectionEnd: {
            get: function() {
                return this._input.selectionEnd;
            },
            set: function(n) {
                this._input.selectionEnd = n;
            }
        },
        /**
         * @type {Boolean}
         */
        focused: {
            get: function() {
                return this._focused;
            },
            set: function(bool) {
                this._focused = bool;
                if (bool) {
                    this._input.focus();
                } else {
                    this._input.blur();
                }
            }
        },
        /**
         * プレースホルダ.
         * @type {String}
         */
        placeholder: {
            get: function() {
                return this._input.placeholder;
            },
            set: function(value) {
                this._input.placeholder = value;
            }
        },
        /**
         * テキストボックスに入力された値.
         * @type {String}
         */
        value: {
            get: function() {
                return this._input.value;
            },
            set: function(value) {
                this._input.value = value;
            }
        },
        /**
         * テキストボックスの横幅.
         * @type {Number}
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._style.width = width + 'px';
                this._input.style.width = width + 'px';
            }
        },
        /**
         * テキストボックスの縦幅.
         * @type {Number}
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._style.height = height + 'px';
                this._input.style.height = height + 'px';
            }
        }
    });

    /**
     * @scope enchant.widget.InputSelectBox
     */
    enchant.widget.InputSelectBox = enchant.Class.create(enchant.widget.Input, {
        /**
         * セレクトボックス.
         * @param {*} option オプションに設定する値.
         * @example
         *   var option = {
         *       male: '男',
         *       female: '女'
         *   };
         *   var selectbox = new InputSelectBox(option);
         *
         * @constructs
         * @extends enchant.widget.Input
         */
        initialize: function(table) {
            enchant.widget.Input.call(this, 'select');
            var content;
            for (var prop in table) {
                content = table[prop];
                opt = document.createElement('option');
                opt.value = prop;
                opt.textContent = content;
                this._input.appendChild(opt);
            }

            this._input.addEventListener('mousedown', function(e) {
                e.stopPropagation();
            });

            var metrics = getElementMetrics(this._element.innerHTML);
            this.width = metrics.width;
            this.height = metrics.height;
        },
        /**
         * 選択されている項目.
         * @type {String}
         */
        selected: {
            get: function() {
                return this._input.options[this._input.selectedIndex].value;
            },
            set: function(value) {
                var opt;
                for (var i = 0, l = this._input.options.length; i < l; i++) {
                    opt = this._input.options[i];
                    if (opt.getAttribute('value') == value) {
                        opt.selected = true;
                    } else {
                        opt.selected = false;
                    }
                }
                return value;
            }
        }
    });

    /**
     * @scope enchant.widget.InputCheckBox
     */
    enchant.widget.InputCheckBox = enchant.Class.create(enchant.widget.Input, {
        /**
         * チェックボックス.
         * @param {String} value 値.
         * @param {String} text ラベルテキスト.
         * @param {Boolean} checked チェックされているかどうか.
         * @constructs
         * @extends enchant.widget.Input
         */
        initialize: function(value, text, checked) {
            enchant.widget.Input.call(this);
            this._input.type = 'checkbox';
            var label = document.createDocumentFragment();
            label.textContent = text;
            this._element.appendChild(label);
            this.checked = checked;
            var metrics = getElementMetrics(this._element.innerHTML);
            this.width = metrics.width;
            this.height = metrics.height;
        },
        /**
         * チェックされているかどうか.
         * @type {Boolean}
         */
        checked: {
            get: function() {
                return this._input.checked;
            },
            set: function(value) {
                this._input.checked = !!value;
            }
        }
    });

    /**
     * @scope enchant.widget.InputTextArea
     */
    enchant.widget.InputTextArea = enchant.Class.create(enchant.Entity, {
        /**
         * テキストエリア.
         * @constructs
         * @extends enchant.Entity
         */
        initialize: function() {
            enchant.Entity.call(this);
            var textarea = this._textarea = document.createElement('textarea');
            textarea.style.resize = 'none';
            textarea.style.font = enchant.widget._env.textareaFont;
            this._element = document.createElement('div');
            this._element.appendChild(textarea);
            var that = this;
            this._focused = false;
            this._next = null;
            this._prev = null;

            var that = this;
            this.addEventListener(enchant.Event.TOUCH_END, function() {
                this._updateVerticalDist();
            });
            this._textarea.addEventListener('input', function() {
                that._updateVerticalDist();
            });
            this._textarea.addEventListener('focus', function() {
                that._focused = true;
            });
            this._textarea.addEventListener('blur', function() {
                that._focused = false;
            });
            this._textarea.addEventListener('change', function(e) {
                that.dispatchEvent(new enchant.Event(enchant.Event.CHANGE));
            });
        },
        _updateVerticalDist: function() {
            var w = this.value.split('\n');
            var n = this.selectionStart;
            var s = 0;
            for (var i = 0, l = w.length; i < l; i++) {
                n -= w[i].length + 1;
                if (n < 0) {
                    break;
                }
                s += w[i].length + 1;
            }
            var ind = this.selectionStart - s;
            if (0 < i) {
                this._prev = -Math.max(w[i - 1].length, ind) - 1;
            } else {
                this._prev = -ind;
            }
            if (i < l - 1) {
                this._next = w[i].length - ind + Math.min(ind, w[i + 1].length) + 1;
            } else {
                this._next = w[i].length - ind;
            }
        },
        /**
         * @type {Number}
         */
        selectionStart: {
            get: function() {
                return this._textarea.selectionStart;
            },
            set: function(n) {
                this._textarea.selectionStart = n;
            }
        },
        /**
         * @type {Number}
         */
        selectionEnd: {
            get: function() {
                return this._textarea.selectionEnd;
            },
            set: function(n) {
                this._textarea.selectionEnd = n;
            }
        },
        /**
         * @type {Boolean}
         */
        focused: {
            get: function() {
                return this._focused;
            },
            set: function(bool) {
                this._focused = bool;
                if (bool) {
                    this._textarea.focus();
                } else {
                    this._textarea.blur();
                }
            }
        },
        /**
         [lang]ja]
         * プレースホルダ.
         [/lang]
         * @type {String}
         */
        placeholder: {
            get: function() {
                return this._textarea.placeholder;
            },
            set: function(value) {
                this._textarea.placeholder = value;
            }
        },
        /**
         * テキストエリアに入力された値.
         * @type {String}
         */
        value: {
            get: function() {
                return this._textarea.value;
            },
            set: function(value) {
                this._textarea.value = value;
            }
        },
        /**
         * テキストエリアの横幅.
         * @type {Number}
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._width = width;
                this._style.width = width + 'px';
                this._textarea.style.width = width + 'px';
            }
        },
        /**
         * テキストエリアの縦幅.
         * @type {Number}
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._height = height;
                this._style.height = height + 'px';
                this._textarea.style.height = height + 'px';
            }
        }
    });

    /**
     * @scope enchant.widget.AlertScene
     */
    enchant.widget.AlertScene = enchant.Class.create(enchant.widget.Modal, {
        /**
         * アラートシーン.
         * 他の入力を遮り, アラートを表示する.
         * @param {*} content 表示するコンテンツ.
         * @param {String} acceptName 了承ボタンのラベル.
         * @example
         *     var alert = new ConfirmScene('それはできません', 'OK');
         *     alert.callback = function() {
         *     };
         *     alert.onaccept = function() {
         *     };
         * @constructs
         * @extends enchant.widget.Modal
         */
        initialize: function(content, acceptName) {
            var core = enchant.Core.instance;
            enchant.widget.Modal.call(this);
            this._onaccept = function() {
            };
            this.callback = function() {
            };
            acceptName = acceptName || enchant.widget._env.acceptName;

            var alert = new enchant.widget.Alert(content, acceptName);
            this.addChild(alert);
            alert.alignHorizontalCenterIn(this).alignVerticalCenterIn(this);

            var scene = this;

            alert.onaccept = function() {
                core.popScene();
                scene._onaccept.apply(this, arguments);
            };
            alert.addEventListener(enchant.Event.ACCEPT, function() {
                scene.callback();
            });
            this.addEventListener(enchant.Event.ENTER, function() {
                Effect.popup.call(alert);
            });
        },
        /**
         * @type {Function}
         */
        onaccept: {
            get: function() {
                return this._onaccept;
            },
            set: function(func) {
                this._onaccept = func;
            }
        }
    });

    /**
     * @scope enchant.widget.ConfirmScene
     */
    enchant.widget.ConfirmScene = enchant.Class.create(enchant.widget.Modal, {
        /**
         * コンファームシーン.
         * 他の入力を遮り, 選択画面を表示する.
         * @param {*} content 表示するコンテンツ.
         * @param {String} acceptName 了承ボタンのラベル.
         * @param {String} cancelName キャンセルボタンのラベル.
         * @example
         *     var confirm = new ConfirmScene('よろしいですか', 'OK', 'NO');
         *     confirm.callback = function(bool) {
         *         // acceptならtrue, cancelならfalseが返ってってくる.
         *     };
         *     // cancel, accept個別に処理を設定することも可能.
         *     confirm.oncancel = function() {
         *     };
         *     confirm.onaccept = function() {
         *     };
         * @constructs
         * @extends enchant.widget.Modal
         */
        initialize: function(content, acceptName, cancelName) {
            var core = enchant.Core.instance;
            enchant.widget.Modal.call(this);
            this._oncancel = function() {
            };
            this._onaccept = function() {
            };
            this.callback = function() {
            };
            cancelName = cancelName || enchant.widget._env.cancelName;
            acceptName = acceptName || enchant.widget._env.acceptName;

            var confirm = new enchant.widget.Confirm(content, acceptName, cancelName);
            this.addChild(confirm);
            confirm.alignHorizontalCenterIn(this).alignVerticalCenterIn(this);
            var scene = this;

            confirm.oncancel = function() {
                core.popScene();
                scene._oncancel.apply(this, arguments);
            };
            confirm.onaccept = function() {
                core.popScene();
                scene._onaccept.apply(this, arguments);
            };
            confirm.addEventListener(enchant.Event.CANCEL, function() {
                scene.callback(false);
            });
            confirm.addEventListener(enchant.Event.ACCEPT, function() {
                scene.callback(true);
            });
            this.addEventListener(enchant.Event.ENTER, function() {
                Effect.popup.call(confirm);
            });
        },
        /**
         * @type {Function}
         */
        oncancel: {
            get: function() {
                return this._oncancel;
            },
            set: function(func) {
                this._oncancel = func;
            }
        },
        /**
         * @type {Function}
         */
        onaccept: {
            get: function() {
                return this._onaccept;
            },
            set: function(func) {
                this._onaccept = func;
            }
        }
    });

    /**
     * @scope enchant.widget.PromptScene
     */
    enchant.widget.PromptScene = enchant.Class.create(enchant.widget.Modal, {
        /**
         * コンファームシーン.
         * 他の入力を遮り, 入力画面を表示する.
         * 複数行に渡る入力をさせたい時は, {@link enchant.widget.InputScene}を使用する.
         * @param {*} content 表示するコンテンツ.
         * @param {String} acceptName 了承ボタンのラベル.
         * @param {String} cancelName キャンセルボタンのラベル.
         * @param {String} placeholder プレースホルダ.
         * @example
         *     var confirm = new PromptScene('名前を入力してください', 'OK', 'cancel');
         *     confirm.placeholder = 'なまえ';
         *     confirm.callback = function(text) {
         *         // acceptなら入力された文字列, cancelならnullが返ってってくる.
         *     };
         *     // cancel, accept個別に処理を設定することも可能.
         *     confirm.oncancel = function() {
         *     };
         *     confirm.onaccept = function(text) {
         *     };
         * @see enchant.widget.InputScene
         * @constructs
         * @extends enchant.widget.Modal
         */
        initialize: function(content, acceptName, cancelName, placeholder) {
            var core = enchant.Core.instance;
            var margin = enchant.widget._env.dialogMargin;
            enchant.widget.Modal.call(this);
            cancelName = cancelName || enchant.widget._env.cancelName;
            acceptName = acceptName || enchant.widget._env.acceptName;
            this.callback = function() {
            };
            this._oncancel = function() {
            };
            this._onaccept = function() {
            };
            placeholder = placeholder || '';

            var prompt = this._prompt = new enchant.widget.Prompt(content, acceptName, cancelName, placeholder);
            prompt.alignHorizontalCenterIn(this).alignVerticalCenterIn(this);
            this.addChild(prompt);
            var scene = this;

            prompt.oncancel = function() {
                core.popScene();
                scene._oncancel.apply(this, arguments);
            };
            prompt.onaccept = function() {
                core.popScene();
                scene._onaccept.apply(this, arguments);
            };
            prompt.addEventListener(enchant.Event.CANCEL, function() {
                scene.callback(null);
            });
            prompt.addEventListener(enchant.Event.ACCEPT, function() {
                scene.callback(prompt.value);
            });
            this.addEventListener(enchant.Event.ENTER, function() {
                Effect.popup.call(prompt);
            });
            this.addEventListener(enchant.Event.UP_BUTTON_DOWN, function() {
                if (prompt._input.focused) {
                    prompt._input.selectionStart = 0;
                    prompt._input.selectionEnd = 0;
                }
            });
            this.addEventListener(enchant.Event.DOWN_BUTTON_DOWN, function() {
                if (prompt._input.focused) {
                    prompt._input.selectionStart = prompt._input.value.length;
                    prompt._input.selectionEnd = prompt._input.value.length;
                }
            });
            this.addEventListener(enchant.Event.LEFT_BUTTON_DOWN, function() {
                if (prompt._input.focused) {
                    prompt._input.selectionStart -= 1;
                    prompt._input.selectionEnd -= 1;
                }
            });
            this.addEventListener(enchant.Event.RIGHT_BUTTON_DOWN, function() {
                if (prompt._input.focused) {
                    prompt._input.selectionStart += 1;
                }
            });
        },
        /**
         * content of prompt
         * @type {String}
         */
        value: {
            get: function() {
                return this._prompt.value;

            },
            set: function(value) {
                this._prompt.value = value;
            }
        },
        /**
         * @type {Function}
         */
        oncancel: {
            get: function() {
                return this._oncancel;
            },
            set: function(func) {
                this._oncancel = func;
            }
        },
        /**
         * @type {Function}
         */
        onaccept: {
            get: function() {
                return this._onaccept;
            },
            set: function(func) {
                this._onaccept = func;
            }
        }
    });

    /**
     * @scope enchant.widget.InputScene
     */
    enchant.widget.InputScene = enchant.Class.create(enchant.widget.Modal, {
        /**
         * インプットシーン.
         * 他の入力を遮り, 入力画面を表示する.
         * {@link enchant.widget.PromptScene}と違い, 複数行に渡る入力ができる.
         * @param {*} content 表示するコンテンツ.
         * @param {String} acceptName 了承ボタンのラベル.
         * @param {String} cancelName キャンセルボタンのラベル.
         * @param {String} placeholder プレースホルダ.
         * @example
         *     var input = new InputScene('新しいツイート', 'ツイート', 'やめる', '@twitter ');
         *     input.callback = function(text) {
         *         // acceptなら入力された文字列, cancelならnullが返ってってくる.
         *     };
         *     // cancel, accept個別に処理を設定することも可能.
         *     input.oncancel = function() {
         *     };
         *     input.onaccept = function(text) {
         *     };
         * @constructs
         * @extends enchant.widget.Modal
         */
        initialize: function(text, acceptName, cancelName, placeholder) {
            var core = enchant.Core.instance;
            var minheight = enchant.widget._env.inputMinHeight;
            var maxheight = enchant.widget._env.inputMaxHeight;
            var dh = maxheight - minheight;
            this.callback = function() {
            };
            this._oncancel = function() {
            };
            this._onaccept = function() {
            };
            this._menu = null;
            cancelName = cancelName || enchant.widget._env.cancelName;
            acceptName = acceptName || enchant.widget._env.acceptName;
            placeholder = placeholder || '';

            enchant.widget.Modal.call(this);
            var scene = this;

            var cancel = new enchant.widget.Button(cancelName);
            var accept = new enchant.widget.Button(acceptName);
            var bar = new enchant.widget.NavigationBar(text, cancel, accept);
            this.addChild(bar);
            var textarea = this._textarea = new enchant.widget.InputTextArea();
            textarea.y += bar.height;
            textarea.width = core.width;
            textarea.height = maxheight;
            textarea.placeholder = placeholder;
            textarea.oncancel = function() {
                core.popScene();
                scene._oncancel.apply(this, arguments);
            };
            textarea.onaccept = function() {
                core.popScene();
                scene._onaccept.apply(this, arguments);
            };
            this.addChild(textarea);

            var _area = textarea._textarea;
            _area.onfocus = function() {
                Effect.resizeTo.call(textarea, core.width, minheight, 5, enchant.Easing.QUAD_EASEOUT);
                if (scene._menu != null) {
                    scene._menu.tl.moveBy(0, -dh, 5, enchant.Easing.QUAD_EASEOUT);
                }
            };
            _area.onblur = function() {
                Effect.resizeTo.call(textarea, core.width, maxheight, 5, enchant.Easing.QUAD_EASEOUT);
                if (scene._menu != null) {
                    scene._menu.tl.moveBy(0, dh, 5, enchant.Easing.QUAD_EASEOUT);
                }
            };
            cancel.addEventListener(enchant.Event.TOUCH_END, function() {
                textarea.dispatchEvent(new enchant.Event(enchant.Event.CANCEL));
                scene.callback(null);
            });
            accept.addEventListener(enchant.Event.TOUCH_END, function() {
                textarea.dispatchEvent(new enchant.Event(enchant.Event.ACCEPT));
                scene.callback(textarea.value);
            });
            this.addEventListener(enchant.Event.UP_BUTTON_DOWN, function() {
                if (textarea.focused) {
                    textarea.selectionStart += textarea._prev;
                    textarea.selectionEnd += textarea._prev;
                    textarea._updateVerticalDist();
                }
            });
            this.addEventListener(enchant.Event.DOWN_BUTTON_DOWN, function() {
                if (textarea.focused) {
                    textarea.selectionStart += textarea._next;
                    textarea._updateVerticalDist();
                }
            });
            this.addEventListener(enchant.Event.LEFT_BUTTON_DOWN, function() {
                if (textarea.focused) {
                    textarea.selectionStart -= 1;
                    textarea.selectionEnd -= 1;
                    textarea._updateVerticalDist();
                }
            });
            this.addEventListener(enchant.Event.RIGHT_BUTTON_DOWN, function() {
                if (textarea.focused) {
                    textarea.selectionStart += 1;
                    textarea._updateVerticalDist();
                }
            });
        },
        /**
         * @type {*}
         */
        menu: {
            get: function() {
                return this._menu;
            },
            set: function(menu) {
                if (this._menu) {
                    this.removeChild(this._menu);
                }
                this.x = 0;
                this.y = enchant.widget._env.itemHeight + enchant.widget._env.inputMaxHeight;
                this.addChild(menu);
                this._menu = menu;
            }
        },
        /**
         * テキストエリアに入力された値.
         * @type {String}
         */
        value: {
            get: function() {
                return this._textarea.value;
            },
            set: function(value) {
                this._textarea.value = value;
            }
        },
        /**
         * @type {String}
         */
        placeholder: {
            get: function() {
                return this._textarea.placeholder;
            },
            set: function(str) {
                this._textarea.placeholder = str;
            }
        },
        /**
         * @type {Function}
         */
        oncancel: {
            get: function() {
                return this._oncancel;
            },
            set: function(func) {
                this._oncancel = func;
            }
        },
        /**
         * @type {Function}
         */
        onaccept: {
            get: function() {
                return this._onaccept;
            },
            set: function(func) {
                this._onaccept = func;
            }
        }
    });

    /**
     * @scope enchant.widget.ListElement
     */
    enchant.widget.ListElement = enchant.Class.create(enchant.widget.EntityGroup, {
        /**
         * Listの項目.
         * 通常, {@link enchant.widget.ListItem}や, {@link enchant.widget.ListItemVertical}を使用する.
         * @param {Number} width 要素の横幅.
         * @param {Number} height 要素の縦幅.
         * @constructs
         * @extends enchant.widget.EntityGroup
         */
        initialize: function(width, height) {
            enchant.widget.EntityGroup.call(this, width, height);
            this._content;
            this._rawContent;
        },
        /**
         * 変更を更新する.
         */
        refresh: function() {
            var content = this._content;
            var margin = enchant.widget._env.listItemMargin;
            if (content) {
                content.alignLeftIn(this, margin).alignVerticalCenterIn(this);
            }
            this.background = this._background;
        },
        /**
         * ListElementの内容.
         * @type {enchant.Entity[]}
         */
        content: {
            get: function() {
                return this._rawContent;
            },
            set: function(content) {
                this._rawContent = content;
                content = enchant.widget.parseContent(content);
                if (this._content) {
                    this.removeChild(this._content);
                }
                this.addChild(content);
                this._content = content;
                this.refresh();
            }
        },
        /**
         * @type {Number}
         */
        width: {
            get: function() {
                return this._width;
            },
            set: function(width) {
                this._style.width = (this._width = width) + 'px';
                if (this.background instanceof enchant.widget.Ninepatch) {
                    this.background.width = this.width;
                }
                if (this._content) {
                    this.refresh();
                }
            }
        },
        /**
         * @type {Number}
         */
        height: {
            get: function() {
                return this._height;
            },
            set: function(height) {
                this._style.height = (this._height = height) + 'px';
                if (this.background instanceof enchant.widget.Ninepatch) {
                    this.background.height = this.height;
                }
                if (this._content) {
                    this.refresh();
                }
            }
        }
    });

    /**
     * @scope enchant.widget.ListItem
     */
    enchant.widget.ListItem = enchant.Class.create(enchant.widget.ListElement, {
        /**
         * Listの項目.
         * アイコン, 左端のボタンが設定できる.
         * 縦に並ぶ項目を設定したいときは, {@link enchant.widget.ListItemVertical}を使用する.
         * @param {Number} width 要素の横幅.
         * @param {Number} height 要素の縦幅.
         * @param {*} [content] ListItemの内容.
         * @param {enchant.Sprite|enchant.Surface} [icon] ListItemのアイコン.
         * @param {enchant.Sprite|enchant.Surface} [rightIcon] ListItemの左側のアイコン.
         * @see enchant.widget.ListItemVertical
         * @constructs
         * @extends enchant.widget.ListElement
         */
        initialize: function(width, height, content, icon, rightIcon) {
            var core = enchant.Core.instance;
            width = width || core.width;
            height = height || enchant.widget._env.itemHeight;
            content = content || '';
            enchant.widget.ListElement.call(this, width, height);
            this._icon;
            this._rawIcon;
            this._rightIcon;
            this._rawRightIcon;
            this.content = content;
            if (icon) {
                this.icon = icon;
            }
            if (rightIcon) {
                this.rightIcon = rightIcon;
            }
            var np = new enchant.widget.Ninepatch(this.width, this.height);
            np.src = core.assets['listItemBg.png'];
            this.background = np;
        },
        /**
         * 変更を更新する.
         */
        refresh: function() {
            var icon = this._icon;
            var content = this._content;
            var right = this._rightIcon;
            var margin = enchant.widget._env.listItemMargin;
            if (icon) {
                Adjust.fitToY.call(icon, this, margin, margin);
                icon.alignLeftIn(this, margin).alignVerticalCenterIn(this);
                if (content) {
                    content.alignRightOf(icon, margin).alignVerticalCenterIn(this);
                }
            } else if (content) {
                content.alignLeftIn(this, margin).alignVerticalCenterIn(this);
            }
            if (right) {
                right.alignRightIn(this, margin).alignVerticalCenterIn(this);
            }
        },
        /**
         * アイコン.
         * 左側に表示される.
         * @type {enchant.Sprite|enchant.Surface}
         */
        icon: {
            get: function() {
                return this._rawIcon;
            },
            set: function(icon) {
                this._rawIcon = icon;
                icon = enchant.widget.parseContent(icon);
                if (this._icon) {
                    this.removeChild(this._icon);
                }
                this.addChild(icon);
                this._icon = icon;
                this.refresh();
            }
        },
        /**
         * 右側のアイコン.
         * 右側に表示される.
         * @type {enchant.Sprite|enchant.Surface}
         */
        rightIcon: {
            get: function() {
                return this._rawRightIcon;
            },
            set: function(right) {
                this._rawRightIcon = right;
                right = enchant.widget.parseContent(right);
                if (this._rightIcon) {
                    this.removeChild(this._rightIcon);
                }
                this.addChild(right);
                this._rightIcon = right;
                this.refresh();
            }
        }
    });

    /**
     * @scope enchant.widget.ListItemVertical
     */
    enchant.widget.ListItemVertical = enchant.Class.create(enchant.widget.ListElement, {
        /**
         * Listの項目.
         * ヘッダ, フッタが設定できる.
         * @param {Number} width 要素の横幅.
         * @param {Number} height 要素の縦幅.
         * @param {*} [content] ListItemVerticalの内容.
         * @param {*} [header] ListItemのヘッダ.
         * @param {*} [footer] ListItemのフッタ.
         * @constructs
         * @extends enchant.widget.ListElement
         */
        initialize: function(width, height, content, header, footer) {
            var core = enchant.Core.instance;
            enchant.widget.ListElement.call(this, width, height);
            this._header;
            this._rawHeader;
            this._footer;
            this._rawFooter;
            if (content) {
                this.content = content;
            }
            if (header) {
                this.header = header;
            }
            if (footer) {
                this.footer = footer;
            }
            this.refresh();
            var np = new enchant.widget.Ninepatch(this.width, this.height);
            np.src = core.assets['listItemBg.png'];
            this.background = np;
        },
        /**
         * 変更を更新する.
         */
        refresh: function() {
            var header = this._header;
            var footer = this._footer;
            var content = this._content;
            var margin = enchant.widget._env.listItemMargin;
            if (header) {
                header.alignLeftIn(this, margin).alignTopIn(this, margin);

                Adjust.fillX.call(content, this, margin);
                if (content) {
                    content.alignLeftIn(this, margin).alignBottomOf(header, margin);
                }
            } else {
                Adjust.fillX.call(content, this, margin);
                if (content) {
                    content.alignLeftIn(this, margin).alignTopIn(this, margin);
                }
            }
            if (footer) {
                footer.alignLeftIn(this, margin).alignBottomOf(content, margin);
            }
            var height = 0;
            var p;
            var scale;
            var contents = [ header, content, footer ];
            for (prop in contents) {
                p = contents[prop];
                if (p) {
                    scale = p.scaleY || 1;
                    height += ~~(p.height * scale);
                    height += margin * 2;
                }
            }
            this._style.height = (this._height = height) + 'px';
            if (this.background instanceof enchant.widget.Ninepatch) {
                this.background.height = this.height;
            }
        },
        /**
         * ヘッダ.
         * contentの上に表示される.
         * @type {*}
         */
        header: {
            get: function() {
                return this._rawHeader;
            },
            set: function(header) {
                this._rawHeader = header;
                header = enchant.widget.parseContent(header);
                if (this._header) {
                    this.removeChild(this._header);
                }
                this.addChild(header);
                this._header = header;
                this.refresh();
            }
        },
        /**
         * フッタ.
         * contentの下に表示される.
         * @type {*}
         */
        footer: {
            get: function() {
                return this._rawFooter;
            },
            set: function(footer) {
                this._rawFooter = footer;
                footer = enchant.widget.parseContent(footer);
                if (this._footer) {
                    this.removeChild(this._footer);
                }
                this.addChild(footer);
                this._footer = footer;
                this.refresh();
            }
        }
    });

    /**
     * @scope enchant.widget.ScrollView
     */
    enchant.widget.ScrollView = enchant.Class.create(enchant.widget.EntityGroup, {
        /**
         * スクロールビュー.
         * 設定したコンテンツをスクロール可能.
         * @param {Number} width ビューの横幅.
         * @param {Number} height ビューの縦幅.
         * @constructs
         * @extends enchant.widget.EntityGroup
         */
        initialize: function(width, height) {
            enchant.widget.EntityGroup.call(this, width, height);
            this._style.overflow = 'hidden';
            this._content;
        },
        /**
         * ScrollViewの内容.
         * @type {enchant.Entity}
         */
        content: {
            oet: function() {
                return this._content;
            },
            set: function(content) {
                if (this._content) {
                    this.removeChild(this._content);
                }
                this.addChild(content);
                this._content = content;
            }
        },
        /**
         * コンテンツのスクロールを行う.
         * 正の値が上方向のスクロールとなる.
         * @param {Number} dy スクロール量.
         */
        scroll: function(dy) {
            if (!this._content) {
                return;
            }
            if (this.height >= this._content.height) {
                this._content.y = 0;
                return;
            }
            var max = 0
            var min = this.height - this._content.height

            var sy = this._content.y + dy;
            if (sy > max) {
                dy = max - this._content.y;
            } else if (sy < min) {
                dy = min - this._content.y;
            }
            this._content.y += dy;
        }
    });

    /**
     * @scope enchant.widget.ListView
     */
    enchant.widget.ListView = enchant.Class.create(enchant.widget.ScrollView, {
        /**
         * リストビュー.
         * @param {Number} width メニューの横幅.
         * @param {Number} height メニューの縦幅.
         * @param {Boolean} draggable 項目をドラッグできるか設定する.
         * List view.
         * @constructs
         * @extends enchant.widget.ScrollView
         */
        initialize: function(width, height, draggable) {
            enchant.widget.ScrollView.call(this, width, height);
            var detector = new enchant.widget.GestureDetector(this);
            this.draggable = !!draggable;
            this.content = [];
            var dragging = null;
            var dy = 0;
            var prev = null;
            var next = null;
            var pthreshold = 0;
            var nthreshold = 0;
            this._clipping = true;

            enchant.widget.GestureDetector.gestureEvents.forEach(function(type) {
                this.addEventListener(type, function(e) {
                    var item = this.getSelectedItem(e);
                    if (item != null) {
                        item.dispatchEvent(e);
                    }
                });
            }, this);

            var removeChild = enchant.widget.EntityGroup.prototype.removeChild;
            var insertBefore = enchant.widget.EntityGroup.prototype.insertBefore;

            var that = this;
            var checkChangePos = function(direction) {
                var y = dragging.y;
                var my = dragging.height;
                var nextSibling;
                if (prev && y <= pthreshold && direction < 0) {
                    prev.y += my;
                    removeChild.call(that._content, dragging);
                    insertBefore.call(that._content, dragging, prev);
                    updateHoldStat(dragging);
                } else if (next && nthreshold <= y && direction > 0) {
                    next.y -= my;
                    removeChild.call(that._content, dragging);
                    var nextSibling = that._content.childNodes[that._content.childNodes.indexOf(next) + 1];
                    insertBefore.call(that._content, dragging, nextSibling);
                    updateHoldStat(dragging);
                }
            };

            var updateHoldStat = function(element) {
                var i = that._content.childNodes.indexOf(element);
                if (i > 0) {
                    prev = that._content.childNodes[i - 1];
                    pthreshold = prev.y + prev.height - element.height / 2;
                } else {
                    prev = null;
                }
                if (i < that._content.childNodes.length - 1) {
                    next = that._content.childNodes[i + 1];
                    nthreshold = next.y - element.height / 2;
                } else {
                    next = null;
                }
            };
            this.addEventListener(enchant.Event.ENTER_FRAME, function() {
                if (dy != 0) {
                    var old = this._content.y;
                    this.scroll(dy);
                    checkChangePos(-dy);
                    dragging.y -= this._content.y - old;
                }
            });
            this.addEventListener(enchant.Event.HOLD, function(e) {
                if (!this.draggable) {
                    return;
                }
                dragging = this.getSelectedItem(e);
                if (dragging == null) {
                    return;
                }
                dragging.opacity = 0.8;
                dragging._style.zIndex = 2;
                updateHoldStat(dragging);
            });
            this.addEventListener(enchant.Event.RELEASE, function() {
                if (!this.draggable || dragging == null) {
                    return;
                }
                dy = 0;
                if (prev) {
                    dragging.y = prev.y + prev.height;
                } else {
                    dragging.y = 0;
                }
                dragging.opacity = 1.0;
                dragging._style.zIndex = 0;
                dragging = null;
                prev = null;
                next = null;
            });
            var spd = 40;
            this.addEventListener(enchant.Event.DRAG, function(e) {
                if (!this.draggable || dragging == null) {
                    return;
                }
                checkChangePos(e.dy);
                dragging.y += e.dy;
                if (e.localY < spd) {
                    dy = spd - e.localY;
                } else if (this.height - spd < e.localY) {
                    dy = this.height - spd - e.localY;
                } else {
                    dy = 0;
                }
            });
            this.addEventListener(enchant.Event.SLIP, function(e) {
                this.scroll(e.dy);
            });
        },
        /**
         * リストビューの内容を設定する.
         * @type {enchant.widget.ListElement[]}
         */
        content: {
            get: function() {
                return this._content.childNodes;
            },
            set: function(content) {
                var addChild = enchant.widget.EntityGroup.prototype.addChild;
                var removeChild = enchant.widget.EntityGroup.prototype.removeChild;
                if (this._content) {
                    removeChild.call(this, this._content);
                }
                var list = new List(content);
                list.width = this.width;
                addChild.call(this, list);
                this._content = list;
            }
        },
        /**
         * イベントの対象を取得する.
         * @param {enchant.Event} event
         * @return {enchant.widget.ListElement}
         */
        getSelectedItem: function(e) {
            var y = e.localY - this._content.y;
            var list = this._content;
            var child;
            var h = 0;
            for (var i = 0, l = list.childNodes.length; i < l; i++) {
                child = list.childNodes[i];
                h += child.height;
                if (h > y) {
                    return child;
                }
            }
            return null;
        },
        addChild: function(child) {
            this._content.addChild(child);
        },
        removeChild: function(child) {
            this._content.removeChild(child);
        },
        insertBefore: function(child, reference) {
            this._content.insertBefore(child, reference);
        }
    });

    var List = enchant.Class.create(enchant.widget.EntityGroup, {
        initialize: function(array) {
            var core = enchant.Core.instance;
            enchant.widget.EntityGroup.call(this);
            this.width = core.width;
            this.height = core.height;
            this._itemHeight = 0;
            var element;
            for (var i = 0, l = array.length; i < l; i++) {
                element = array[i];
                this.addChild(element);
            }

            this._dragging = null;
            this._pthreshold = 0;
            this._nthreshold = 0;
            this._index = 0;
        },
        addChild: function(child) {
            var i = this.childNodes.length;
            enchant.widget.EntityGroup.prototype.addChild.call(this, child);
            this.refresh(i - 1);
        },
        insertBefore: function(child, reference) {
            enchant.widget.EntityGroup.prototype.insertBefore.call(this, child, reference);
            var i = this.childNodes.indexOf(child);
            this.refresh(i - 1);
        },
        removeChild: function(child) {
            var i = this.childNodes.indexOf(child);
            if (i != -1) {
                enchant.widget.EntityGroup.prototype.removeChild.call(this, child);
                this.refresh(i - 1);
            }
        },
        refresh: function(i) {
            var i, l, h, start, child;
            if (i > 0) {
                start = this.childNodes[i - 1];
                h = start.y + start.height;
            } else {
                i = 0;
                h = 0;
            }
            for (l = this.childNodes.length; i < l; i++) {
                child = this.childNodes[i];
                child.y = h;
                h += child.height;
            }
            this.height = this._itemHeight = h;
        },
        _getElementByLocalPosition: function(localX, localY) {
            var child;
            var h = 0;
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                child = this.childNodes[i];
                h += child.height;
                if (h > localY) {
                    break;
                }
            }
            return child;
        }
    });

    /**
     * @scope enchant.widget.NavigationBar
     */
    enchant.widget.NavigationBar = enchant.Class.create(enchant.widget.EntityGroup, {
        /**
         * ナビゲーションバー.
         * 中央, 右, 左それぞれに項目を設定できる.
         * @param {*} center 中央に表示させたい項目.
         * @param {*} left 左に表示させたい項目.
         * @param {*} right 右に表示させたい項目.
         * @constructs
         * @extends enchant.widget.EntityGroup
         */
        initialize: function(center, left, right) {
            var core = enchant.Core.instance;
            enchant.widget.EntityGroup.call(this, core.width, enchant.widget._env.itemHeight);
            this._center;
            this._rawCenter;
            this._left;
            this._rawLeft;
            this._right;
            this._rawRight;
            this.center = center;
            if (left) {
                this.left = left;
            }
            if (right) {
                this.right = right;
            }
            this.refresh();

            var np = new enchant.widget.Ninepatch(this.width, this.height);
            np.src = core.assets['navigationBar.png'];
            this.background = np;
        },
        /**
         * 変更を更新する.
         */
        refresh: function() {
            var center = this._center;
            var left = this._left;
            var right = this._right;
            var margin = enchant.widget._env.listItemMargin;
            if (center) {
                center.alignHorizontalCenterIn(this).alignVerticalCenterIn(this);
            }
            if (left) {
                left.alignLeftIn(this, margin).alignVerticalCenterIn(this);
            }
            if (right) {
                right.alignRightIn(this, margin).alignVerticalCenterIn(this);
            }
        },
        /**
         * 中央の項目.
         * @type {*}
         */
        center: {
            get: function() {
                return this._rawCenter;
            },
            set: function(center) {
                this._rawCenter = center;
                center = enchant.widget.parseContent(center, enchant.widget._env.navigationBarFont);
                if (this._center) {
                    this.removeChild(this._center);
                }
                this.addChild(center);
                this._center = center;
                this.refresh();
            }
        },
        /**
         * 左の項目.
         * 左詰めで表示される.
         * @type {*}
         */
        left: {
            get: function() {
                return this._rawLeft;
            },
            set: function(left) {
                this._rawLeft = left;
                left = enchant.widget.parseContent(left);
                if (this._left) {
                    this.removeChild(this._left);
                }
                this.addChild(left);
                this._left = left;
                this.refresh();
            }
        },
        /**
         * 右の項目.
         * 右詰めで表示される.
         * @type {*}
         */
        right: {
            get: function() {
                return this._rawRight;
            },
            set: function(right) {
                this._rawRight = right;
                right = enchant.widget.parseContent(right);
                if (this._right) {
                    this.removeChild(this._right);
                }
                this.addChild(right);
                this._right = right;
                this.refresh();
            }
        }
    });

    enchant.widget.Icon = enchant.Class.create(enchant.widget.EntityGroup, {
        initialize: function(icon, text) {
            enchant.widget.EntityGroup.call(this, 44, 44);
            icon = enchant.widget.parseContent(icon);
            text = enchant.widget.parseContent(text, enchant.widget._env.font);
            var sx = 32 / icon.width;
            var sy = 32 / icon.height;
            icon.scaleX = icon.scaleY = Math.min(sx, sy);
            icon.alignHorizontalCenterIn(this).alignTopIn(this);
            text.alignHorizontalCenterIn(this).alignBottomOf(icon, -7);
            this.addChild(icon);
            this.addChild(text);
        }
    });

    /**
     * @scope enchant.widget.IconMenu
     */
    enchant.widget.IconMenu = enchant.Class.create(enchant.widget.EntityGroup, {
        /**
         * アイコンが横に並ぶメニュー.
         * @param {enchant.Entity[]} buttons 設定したいボタンの配列.
         * @constructs
         * @extends enchant.widget.EntityGroup
         */
        initialize: function(buttons) {
            var core = enchant.Core.instance;
            if (!(buttons instanceof Array)) {
                buttons = Array.prototype.slice.call(arguments);
            }
            enchant.widget.EntityGroup.call(this, core.width, enchant.widget._env.itemHeight);
            this._bgs = [];
            this._icons = [];
            this.content = buttons;
            this.refresh();
            this._bgs.forEach(function(bg) {
                var width = bg.width;
                var height = bg.height;
                var np = new enchant.widget.Ninepatch(width, height);
                np.src = core.assets['iconMenuBg.png'];
                bg.image = np;
            });
        },
        /**
         * 変更を更新する.
         */
        getSelectedItem: function(e) {
            var x = e.localX;
            var list = this._bgs;
            var child;
            var w = 0;
            for (var i = 0, l = list.childNodes.length; i < l; i++) {
                child = list.childNodes[i];
                w += child.width;
                if (w > x) {
                    return this._icons[i];
                }
            }
            return null;
        },
        refresh: function() {
            var icon, bg, bgwidth;
            var margin = enchant.widget._env.listItemMargin;
            var arr = distribute(this.width, this._icons.length);
            var _width = 0;
            var menu = this;

            for (var i = 0, l = this._icons.length; i < l; i++) {
                bgwidth = arr[i];
                icon = this._icons[i];
                bg = this._bgs[i];
                bg.width = bgwidth;
                bg.height = this.height;
                bg.image.resize(bg.width, bg.height);
                bg.x = _width;

                icon.addEventListener(enchant.Event.TOUCH_END, (function(bg) {
                    return function(e) {
                        bg.dispatchEvent(e);
                    };
                })(bg));
                bg.addEventListener(enchant.Event.TOUCH_END, (function(i, elem) {
                    return function(e) {
                        var evt = new enchant.Event(enchant.Event.TAP);
                        evt.x = e.x;
                        evt.y = e.y;
                        evt.index = i;
                        evt.element = elem;
                        menu.dispatchEvent(evt);
                    };
                })(i, icon));

                icon.alignHorizontalCenterIn(bg).alignVerticalCenterIn(bg);
                icon.x += _width;

                _width += bg.width;
            }
        },
        addChild: function(child) {
            var core = enchant.Core.instance;
            var addChild = enchant.widget.EntityGroup.prototype.addChild;
            var size = enchant.widget._env.itemHeight;
            var sp = new enchant.Sprite(size, size);
            addChild.call(this, sp);
            this._bgs.push(sp);
            addChild.call(this, child);
            this._icons.push(child);
            var np = new enchant.widget.Ninepatch(sp.width, sp.height);
            np.src = core.assets['iconMenuBg.png'];
            sp.image = np;
            this.refresh();
        },
        insertBefore: function(child, target) {
            var core = enchant.Core.instance;
            var insertBefore = enchant.widget.EntityGroup.prototype.insertBefore;
            var i = this._icons.indexOf(target);
            var size = enchant.widget._env.itemHeight;
            var sp, np;
            if (i != -1) {
                target = this._bgs[i];
                sp = new enchant.Sprite(size, size);
                insertBefore.call(this, sp, target);
                this._bgs.splice(i, 0, sp);
                insertBefore.call(this, child, target);
                this._icons.splice(i, 0, child);
                np = new enchant.widget.Ninepatch(sp.width, sp.height);
                np.src = core.assets['iconMenuBg.png'];
                sp.image = np;
                this.refresh();
            }
        },
        removeChild: function(child) {
            var removeChild = enchant.widget.EntityGroup.prototype.removeChild;
            var i = this._icons.indexOf(child);
            if (i != -1) {
                var bg = this._bgs[this._bgs.length - 1];
                removeChild.call(this, bg);
                this._bgs.pop();
                removeChild.call(this, child);
                this._icons.splice(i, 1);
                this.refresh();
            }
        },
        /**
         * アイコンを設定する.
         * @param {enchant.Entity[]} content 表示させたいオブジェクトの配列.
         */
        content: {
            get: function() {
                return this._icons;
            },
            set: function(content) {
                var removeChild = enchant.widget.EntityGroup.prototype.removeChild;
                var menu = this;
                if (this.childNodes) {
                    this.childNodes.slice().forEach(function(child) {
                        removeChild.call(menu, child);
                    });
                }
                content.forEach(function(child) {
                    menu.addChild(child);
                });
            }
        }
    });

})();
