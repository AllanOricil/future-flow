import Connection from '../entities/connection.js';
import stringify from 'json-stringify-safe';
import { syntaxHighlight } from '../utils/json.js';
import Position from '../transforms/position.js';
import Padding from '../styles/padding.js';
import Transform from '../transforms/transform.js';
import EventEmitter from './eventEmitter.js';

export default class Entity {

    static get MAX_WIDTH() {
        return 350;
    }

    static get PADDING() {
        return {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15,
        };
    }

    constructor({
        name,
        padding,
        dimension,
        position,
        parent
    }, canvas) {
        this._eventEmitter = new EventEmitter();
        this._id = +new Date() + Math.random() * 100000;
        this.name = name;
        this._name = name;
        this.connections = [];
        this._selected = false;
        this._hover = false;
        this._z = 0;

        this._transform = new Transform({
            position,
            dimension
        });
        this._oldPosition = new Position(position);
        this._padding = padding ? (typeof padding === 'Padding' ? padding : new Padding(padding)) : Entity.PADDING;
        this._parent = parent;
        this._children = [];
        this._canvas = canvas;
    }

    createEvent(event) {
        return new CustomEvent(event, {
            detail: this,
        });
    }

    addConnection(connection) {
        connection.from = this;
        const newConnection = new Connection(connection);
        this.connections.push(newConnection);
    }

    contains(position) {
        return this._canvas.ctx.isPointInPath(this._shape.path, position.x, position.y, 'nonzero');
    }

    startAnimation(block) {
        const connection = this.getConnectionTo(block);
        connection.startAnimation();
    }

    startAllAnimations() {
        this.connections.forEach(connection => {
            connection.startAnimation();
        });
    }

    stopAllAnimations() {
        this.connections.forEach(connection => {
            connection.stopAnimation();
        });
    }

    stopAnimation(entity) {
        const connection = this.getConnectionTo(entity);
        connection.stopAnimation();
    }

    getConnectionTo(entity) {
        return this.connections.find(connection => {
            return connection.to.name === entity.name;
        });
    }
    
    getConnectionByName(name) {
        return this.connections.find(connection =>  connection.to.name === name);
    }

    removeConnection(to) {
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].to.name === to.name) {
                this.connections.splice(i, 1);
                return;
            }
        }
    }

    toString() {
        let connections = [];
        this.connections.forEach(connection => {
            connections.push({
                id: connection.to.id,
                name: connection.to.name
            });
        });
        return stringify({
            id: this._id,
            name: this.name,
            position: {
                x: this._position.x,
                y: this._position.y
            },
            connections,
            content: {
                header: this.header ? this.header.text : null,
                body: this.body ? this.body.text : null,
                footer: this.footer ? this.footer.text : null
            }
        }, null, 4);
    }

    prettier() {
        return syntaxHighlight(this.toString());
    }

    on(event, callback) {
        this._eventEmitter.on(event, callback);
    }

    emit(event, data) {
        this._eventEmitter.emit(event, data);
    }

    set state(newState) {
        if (this.states.includes(newState))
            this.emit(newState, {
                detail: this
            });
    }

    get shape() {
        return this._shape;
    }

    get padding() {
        return this._padding;
    }

    get dimension() {
        return this._transform.dimension;
    }

    get position() {
        return this._transform.position;
    }

    get children() {
        return this._children;
    }

    get parent() {
        return this._parent;
    }

    set position(newValue) {
        this._oldPosition = new Position(this._transform.position);
        this._transform.position.x = newValue.x;
        this._transform.position.y = newValue.y;
    }

    get oldPosition() {
        return this._oldPosition;
    }
}