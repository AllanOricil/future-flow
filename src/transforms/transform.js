import Position from "./position";
import Dimension from "./dimension";
import Rotation from "./rotation";
import Scale from "./scale";

export default class Transform {

    static get POSITION() {
        return {
            x: 0,
            y: 0
        };
    }

    static get DIMENSION() {
        return {
            width: 0,
            height: 0,
        };
    }

    static get ROTATION() {
        return {
            angle: 0
        };
    }

    static get SCALE() {
        return {
            horizontal: 1,
            vertical: 1
        };
    }

    constructor({
        position,
        dimension,
        rotation,
        scale
    }) {
        this._position = position ? position : Transform.POSITION;
        this._dimension = dimension ? dimension : Transform.DIMENSION;
        this._rotation = rotation ? new Rotation(rotation) : Transform.ROTATION;
        this._scale = scale ? new Scale(scale) : Transform.SCALE;
    }

    get position() {
        return this._position;
    }

    get dimension() {
        return this._dimension;
    }

    get rotation() {
        return this._rotation;
    }

    get scale() {
        return this._scale;
    }

}