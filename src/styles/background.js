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

    set color(newColor){
        this._color = new Color(newColor);
    }

    get image() {
        return this._image;
    }

    set Image(newImage){
        this._image = new Image(newImage);
    }

}