import Color from './color.js';
export default class Background {
    constructor({
        color,
        image
    }) {
        this._color = new Color(color);
        if (image) {
            this._image = image ? new Image() : null;
            this._image.addEventListener('load', () => {
                this._loaded = true;
            });
        }
    }

    get color() {
        return this._color;
    }

    set color(newColor) {
        this._color = new Color(newColor);
    }

    get image() {
        return this._image;
    }

}