import Transform from "../transforms/transform";

export default class Image {

    constructor({
        src,
        position,
        dimension,
        rotation,
        scale
    }) {
        this._transform = new Transform({
            position,
            dimension,
            rotation,
            scale
        });
        this._image = new Image(this._tranform.dimension.width, this._transform.dimension.height);
        this._src = src;
        this._image.src = this._src;
        this._image.addEventListener('load', () => {
            this._loaded = true;
        });
        this._loaded = false;
    }

    set src(newValue) {
        this._src = newValue;
        this._loaded = false;
    }

    get transform() {
        return this._transform;
    }

}