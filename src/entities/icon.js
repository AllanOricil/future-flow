import Entity from "../core/entity";

export default class Icon extends Entity {
    constructor({
        src,
        position,
        padding,
        dimension,
        parent
    }) {
        super({
            position,
            padding,
            dimension,
            parent
        });
        this._loaded = false;
        this._image = new Image();
        this._image.src = src;
        this._image.addEventListener('load', () => {
            this._loaded = true;
        });
    }

    get image() {
        return this._image;
    }

    get loaded() {
        return this._loaded;
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.parent.x + this.position.x + this.padding.left,
            this.parent.y + this.position.y + this.padding.top,
            this.dimension.width,
            this.dimension.height
        );
    }
}