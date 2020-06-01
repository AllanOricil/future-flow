import Color from './color.js';
import Image from '../entities/image.js';
export default class Background {
    constructor({
        color,
        image
    }) {
        this._color = color ? new Color(color) : null;
        this._image = image ? new Image({
            image
        }) : null;
    }

    get color() {
        return this._color;
    }

    get image() {
        return this._image;
    }

}