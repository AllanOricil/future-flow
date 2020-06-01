import Color from "./color";

export default class Line {
    constructor({
        weight,
        color,
        enableBezierCurves,
        dashed
    }) {
        this._weight = weight;
        this._color = new Color(color);
        this._enableBezierCurves = enableBezierCurves;
        this._dashed = dashed;
    }

    get weight() {
        return this._weight;
    }

    get color() {
        return this._color;
    }

    get enableBezierCurves() {
        return this._enableBezierCurves;
    }

    get dashed() {
        return this._dashed;
    }
}