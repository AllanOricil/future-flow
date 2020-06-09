import EventEmitter from '../utils/eventEmitter.js';
import Connection from './connection.js';
import stringify from 'json-stringify-safe';
import {
    syntaxHighlight
} from '../utils/json.js';
import Position from '../transforms/position.js';
import Padding from '../styles/padding.js';
import Transform from '../transforms/transform.js';

export default class Entity extends EventEmitter {

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
        super();
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

    update(deltaTime) {}

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

    contains() {
        return this._canvas.ctx.isPointInPath(this._shape.path, this._canvas.mouse.x, this._canvas.mouse.y, 'nonzero');
    }

    startAnimation(block) {
        const connection = this.getConnection(block);
        connection.startAnimation();
    }

    startAllAnimations() {
        this.connections.forEach(connection => {
            connection.startAnimation();
        });
    }

    finishAllAnimations() {
        this.connections.forEach(connection => {
            connection.finishAnimation();
        });
    }

    stopAnimation(block) {
        const connection = this.getConnection(block);
        connection.stopAnimation();
    }

    finishAnimation(block) {
        const connection = this.getConnection(block);
        connection.finishAnimation();
    }

    getConnection(block) {
        return this.connections.find(connection => {
            return connection.to.name === block.name;
        });
    }

    getConnectionByName(name) {
        return this.connections.find(connection => {
            return connection.to.name === name;
        });
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