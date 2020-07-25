export default class EntityManager {

    constructor() {
        this._entitiesMap = new Map();
        [...Array(100).keys()].forEach(layer => {
            this._entitiesMap.set(layer, new Map());
        });
        this._entitiesLayerMap = new Map();
    }

    getLayer(z) {
        return this._entitiesMap.get(z);
    }

    getEntityLayerByName(name) {
        return this.getLayer(this._entitiesLayerMap.get(name));
    }

    getEntityByName(name) {
        const layer = this.getEntityLayerByName(name);
        const entity = layer.get(name);
        return entity;
    }

    addEntity(entity) {
        const layer = this.getLayer(entity._z);
        layer.set(entity._name, entity);
        this._entitiesLayerMap.set(entity._name, entity._z);
    }

    removeEntityByName(name) {
        const entityToRemove = this.getEntityByName(name);
        this.entities.forEach(entity => {
            entity.removeConnection(entityToRemove);
        });
        const entityLayer = this.getEntityLayerByName(name);
        return entityLayer.delete(name);
    }

    clearLayer(z) {
        const layer = this.getLayer(z);
        if (layer) layer.clear();
    }

    get entities() {
        let entities = [];
        for (let [layer, _entities] of this._entitiesMap.entries()) {
            _entities.forEach(entity => {
                entities.push(entity);
            });
        }
        return entities;
    }
}