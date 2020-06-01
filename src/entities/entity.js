import EventEmitter from '../utils/eventEmitter.js';
import Connection from './connection.js';
import stringify from 'json-stringify-safe';
import {
    syntaxHighlight
} from '../utils/json.js';
import Position from '../transforms/position.js';
import Dimension from '../transforms/dimension.js';
import Padding from '../styles/padding.js';

export default class Entity extends EventEmitter {
    static get MAX_WIDTH() {
        return 350;
    }

    static get MAX_HEIGHT() {
        return 500;
    }

    static get PADDING() {
        return {
            top: 15,
            right: 15,
            bottom: 15,
            left: 15,
        };
    }

    static get DIMENSION() {
        return {
            width: 0,
            height: 0
        };
    }

    static get POSITION() {
        return {
            x: 0,
            y: 0
        };
    }

    static get ROTATION() {
        return {
            angle: 0
        };
    }

    static get ICON() {
        return {
            src: null,
            dimension: Entity.DIMENSION,
            padding: Entity.PADDING
        };
    }

    static get BACKGROUND() {
        return {
            color: 'rgb(255,255,255)',
        };
    }

    static get SHADOW() {
        return {
            offsetX: 0,
            offsetY: 0,
            color: 'rgb(0,0,0)',
            blur: 0
        };
    }

    static get COLOR() {
        return {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1
        };
    }

    static get BORDER() {
        return {
            radius: 5,
            lineWidth: 1,
            color: 'black',
            selected: {
                lineWidth: 1,
                color: 'black',
            },
            hover: {
                lineWidth: 1,
                color: 'black',
            },
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

        this._position = position ? (typeof position === 'Position' ? position : new Position(position)) : Entity.POSITION;
        this._oldPosition = new Position(position);
        this._dimension = dimension ? (typeof dimension === 'Dimension' ? dimension : new Dimension(dimension)) : Entity.DIMENSION;
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

    get sides() {
        return [{
                x: this._position.x + this._dimension.width / 2,
                y: this._position.y,
                name: 'top',
            },
            {
                x: this._position.x + this._dimension.width,
                y: this._position.y + this._dimension.height / 2,
                name: 'right',
            },
            {
                x: this._position.x + this._dimension.width / 2,
                y: this._position.y + this._dimension.height,
                name: 'bottom',
            },
            {
                x: this._position.x,
                y: this._position.y + this._dimension.height / 2,
                name: 'left',
            },
        ];
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
        return this._dimension;
    }

    get position() {
        return this._position;
    }

    get children() {
        return this._children;
    }

    get parent() {
        return this._parent;
    }

    set position(newValue) {
        this._oldPosition = new Position(this._position);
        this._position.x = newValue.x;
        this._position.y = newValue.y;
    }

    get oldPosition() {
        return this._oldPosition;
    }
}