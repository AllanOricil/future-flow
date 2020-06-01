export default class Position {

    constructor({
        x,
        y
    }) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return parseInt(this._x.toFixed(0));
    }

    get y() {
        return parseInt(this._y.toFixed(0));
    }

    set x(newValue) {
        this._x = newValue;
    }

    set y(newValue) {
        this._y = newValue;
    }
}