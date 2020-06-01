import Rotation from "../transforms/rotation";
import Border from "../styles/border";
import Shadow from "../styles/shadow";
import Background from "../styles/background";

export default class Shape {

    static get ROTATION() {
        return {
            angle: 0
        };
    }

    static get BACKGROUND() {
        return {
            color: 'rgb(255,255,255)',
        };
    }

    static get SHADOW() {
        return {
            offsetX: 0,
            offsetY: 0,
            color: 'rgb(0,0,0)',
            blur: 0
        };
    }

    static get BORDER() {
        return {
            radius: 5,
            lineWidth: 1,
            color: 'black',
            selected: {
                lineWidth: 1,
                color: 'black',
            },
            hover: {
                lineWidth: 1,
                color: 'black',
            },
        };
    }

    constructor({
        position,
        dimension,
        rotation,
        background,
        border,
        shadow
    }) {
        this._position = position;
        this._dimension = dimension;
        this._rotation = rotation ? (typeof rotation === 'Rotation' ? rotation : new Rotation(rotation)) : Shape.ROTATION;
        this._border = border ? (typeof border === 'Border' ? border : new Border(border)) : Shape.BORDER;
        this._background = background ? (typeof background === 'Background' ? background : new Background(background)) : Shape.BACKGROUND;
        this._shadow = shadow ? (typeof shadow === 'Shadow' ? shadow : new Shadow(shadow)) : Shape.SHADOW;
        this._path = null;
    }

    draw(ctx) {
        if (this._shadow) {
            ctx.shadowColor = this._shadow.color.hex;
            ctx.shadowBlur = this._shadow.blur;
            ctx.shadowOffsetX = this._shadow.offsetX;
            ctx.shadowOffsetY = this._shadow.offsetY;
        }
        ctx.strokeStyle = this._border.color.hex;
        ctx.fillStyle = this._background.color.hex;
        ctx.lineWidth = this._border.width;
    }

    rotateFromPosition(ctx, position) {
        ctx.translate(position.x, position.y);
        ctx.rotate(this._rotation.angle);
        ctx.translate(-position.x, -position.y);
    }

    get sides() {
        const middleWidth = this._dimension.width / 2;
        const middleHeight = this._dimension.height / 2;
        return {
            top: {
                x: this._position.x + middleWidth,
                y: this._position.y
            },
            right: {
                x: this._position.x + this._dimension.width,
                y: this._position.y + middleHeight
            },
            bottom: {
                x: this._position.x + middleWidth,
                y: this._position.y + this._dimension.height
            },
            left: {
                x: this._position.x,
                y: this._position.y + middleHeight
            },
        };
    }

    get path() {
        return this._path;
    }

    set path(newValue) {
        this._path = newValue;
    }

    get border() {
        return this._border;
    }

    get background() {
        return this._background;
    }

    get rotation() {
        return this._rotation;
    }

    get shadow() {
        return this._shadow;
    }

    set rotation(newValue) {
        this._rotation.angle = newValue;
    }

    get position() {
        return this._position;
    }

    set position(newValue) {
        this._position.x = newValue.x;
        this._position.y = newValue.y;
    }
}