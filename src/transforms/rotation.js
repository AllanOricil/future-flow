import Position from "./position";

export default class Rotation {
    constructor({
        angle,
        referential
    }) {
        this._angle = angle;
        this._referential = new Position(referential);
    }

    get angle() {
        return this._angle;
    }

    set angle(newValue) {
        this._angle = newValue;
    }

    get referential() {
        return this._referential;
    }
}