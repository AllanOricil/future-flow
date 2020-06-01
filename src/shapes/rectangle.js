import Shape from "./shape";

export default class Rectangle extends Shape {
    constructor({
        position,
        dimension,
        rotation,
        border,
        background,
        shadow
    }) {
        super({
            position,
            dimension,
            rotation,
            border,
            background,
            shadow
        });
    }

    draw(ctx) {
        ctx.save();
        super.draw(ctx);
        this.rotateFromPosition(ctx, {
            x: this._position.x + this._dimension.width / 2,
            y: this._position.y + this._dimension.height / 2
        });
        this._path = new Path2D();
        var r = this._position.x + this._dimension.width;
        var b = this._position.y + this._dimension.height;

        ctx.beginPath();
        this._path.moveTo(this._position.x + this._border.radius, this._position.y);
        this._path.lineTo(r - this._border.radius, this._position.y);
        this._path.quadraticCurveTo(r, this._position.y, r, this._position.y + this._border.radius);
        this._path.lineTo(r, this._position.y + this._dimension.height - this._border.radius);
        this._path.quadraticCurveTo(r, b, r - this._border.radius, b);
        this._path.lineTo(this._position.x + this._border.radius, b);
        this._path.quadraticCurveTo(this._position.x, b, this._position.x, b - this._border.radius);
        this._path.lineTo(this._position.x, this._position.y + this._border.radius);
        this._path.quadraticCurveTo(this._position.x, this._position.y, this._position.x + this._border.radius, this._position.y);
        this._path.closePath();
        ctx.stroke(this._path);
        ctx.fill(this._path);

        ctx.shadowColor = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.stroke(this._path);
        ctx.restore();
    }

    get area() {
        return this._dimension.width * this._dimension.height;
    }

    get center() {
        return {
            x: this._position.x + this._dimension.width / 2,
            y: this._position.y + this._dimension.height / 2,
        };
    }
}