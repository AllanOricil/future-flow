import Triangle from "../shapes/triangle";
import Circle from "../shapes/circle";
import Position from "../transforms/position";
import Border from "../styles/border";

export default class Connector {

    constructor({
        shape,
        position,
        color,
        fillColor,
        rotation,
        diameter,
        dimension
    }) {
        this._shape = shape === 'triangle' ? new Triangle({
            position: new Position(position),
            dimension,
            rotation,
            border: {
                color
            },
            background: {
                color: fillColor
            }
        }) : new Circle({
            position: new Position(position),
            rotation,
            diameter,
            color,
            fillColor
        });
    }

    draw(ctx) {
        this._shape.draw(ctx);
    }

    get shape() {
        return this._shape;
    }

}