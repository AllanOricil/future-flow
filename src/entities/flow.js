import Canvas from '../core/canvas.js';

export default class Flow {
    constructor({
        canvas,
        options,
        data
    }) {
        this._canvas = new Canvas({
            canvas,
            data,
            options
        });
    }

    getEntityByName(name) {
        return this._canvas.entityManager.getEntityByName(name);
    }

    addEntity(entity) {
        this._canvas.entityManager.addEntity(entity);
    }

    removeEntityByName(name) {
        this._canvas.entityManager.removeEntityByName(name);
    }

    getData() {
        return this._canvas.data;
    }

    setData(data) {
        this._canvas.setData(data);
    }

    on(event, callback) {
        if (
            event === 'onkeypress' ||
            event === 'onkeyup' ||
            event === 'onkeydown'
        ) {
            window[event] = callback;
        } else this._canvas._el.addEventListener(event, callback);
    }

    saveAsImage(name) {
        var link = document.createElement('a');
        link.download = `${name}.png`;
        link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        link.click();
    }
}