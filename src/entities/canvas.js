import EntityManager from './entityManager.js';
import Position from '../transforms/position.js';
import Dimension from '../transforms/dimension.js';
import Scale from '../transforms/scale.js';
import Conditional from './conditional.js';
import Block from './block.js';

export default class Canvas {

    static get SCALE() {
        return {
            horizontal: 1,
            vertical: 1
        };
    }

    static get SCALELIMITS() {
        return {
            max: 2,
            min: 0.2
        };
    }

    static get BACKGROUND() {
        return 'transparent';
    }

    static get FPS() {
        return 60;
    }

    static get CANMOVEBLOCKS() {
        return true;
    }

    static get CANDRAGCANVAS() {
        return true;
    }

    constructor({
        data,
        options,
        canvas
    }) {
        this._entityManager = new EntityManager();
        this._el = canvas || document.getElementById('canvas');
        this._el.width = this._el.parentElement.clientWidth;
        this._el.height = this._el.parentElement.clientHeight;
        this._el.style.maxHeight = 'none';
        this._el.focus();
        this._el.style.backgroundColor = options && options.background ? options.background.color : Canvas.BACKGROUND;

        this._fps = options && options.fps ? options.fps : Canvas.FPS;
        this._canMoveBlocks = options && options.canMoveBlocks ? options.canMoveBlocks : Canvas.CANMOVEBLOCKS;
        this._canDragCanvas = options && options.canDragCanvas ? options.canDragCanvas : Canvas.CANDRAGCANVAS;
        this._origin = new Position({
            x: 0,
            y: 0
        });
        this._dimension = new Dimension({
            width: this._el.parentElement.clientWidth,
            height: this._el.parentElement.clientHeight
        });
        this._mouse = new Position({
            x: 0,
            y: 0
        });
        this._scale = options && options.zoom ? new Scale({
            horizontal: options.zoom.level,
            vertical: options.zoom.level
        }) : Canvas.SCALE;
        this._scaleLimits = options && options.zoom ? {
            max: options.zoom.max,
            min: options.zoom.min,
        } : Canvas.SCALELIMITS;


        if (typeof OffscreenCanvas !== "undefined") {
            if ('OffscreenCanvas' in window) {
                this._offscreenCanvas = this._el.transferControlToOffscreen();
            } else {
                this._offscreenCanvas = new OffscreenCanvas(this._dimension.width, this._dimension.height);
            }
            this._ctx = this._offscreenCanvas.getContext('2d');
        } else {
            this._ctx = this._el.getContext('2d');
        }

        this.setData(data);

        this._intervalId = null;
        this._time = 0;
        this._startTime = 0;
        this._timeToUpdate = 0;
        this._timeToDraw = 0;


        let _isCanvasBeingDragged = false;
        let _selectedEntities = [];
        let _entityBeingDragged = null;
        let _cancelClick = false;
        let _entityBeingHovered = null;
        this._el.addEventListener('mousemove', e => {
            const {
                x,
                y
            } = this.mousePosition(e);
            this._mouse.x = x;
            this._mouse.y = y;

            if (_isCanvasBeingDragged) {
                this._el.style.cursor = 'grabbing';
                this.translate(e.movementX, e.movementY);
                return;
            } else {
                if (_entityBeingDragged) {
                    _cancelClick = true;
                    _entityBeingDragged.position = {
                        x: parseInt(
                            (this._mouse.x - _entityBeingDragged.dimension.width / 2).toFixed(0)
                        ),
                        y: parseInt(
                            (this._mouse.y - _entityBeingDragged.dimension.height / 2).toFixed(0)
                        )
                    };
                    return;
                } else {
                    for (let i = 0; i < this._entityManager.entities.length; i++) {
                        let entity = this._entityManager.entities[i];
                        if (entity.contains(this._mouse.x, this._mouse.y)) {
                            _entityBeingHovered = entity;
                            this._el.style.cursor = 'grabbing';
                            if (!entity._hover) {
                                entity._hover = true;
                                this._el.dispatchEvent(
                                    new CustomEvent('mouseenterentity', {
                                        detail: entity,
                                    })
                                );
                            }
                            return;
                        } else {
                            if (entity._hover) {
                                entity._hover = false;
                                this._el.dispatchEvent(
                                    new CustomEvent('mouseleaveentity', {
                                        detail: entity,
                                    })
                                );
                            }
                        }
                    }
                    _entityBeingHovered = null;
                    this._el.style.cursor = 'default';
                }
            }

            this._el.style.cursor = 'default';
        });

        this._el.addEventListener('mousedown', e => {
            if (_entityBeingHovered) {
                _entityBeingHovered._selected = true;
                if (
                    !_entityBeingDragged &&
                    this._canMoveBlocks &&
                    _entityBeingHovered.isDraggable
                ) {
                    _entityBeingDragged = _entityBeingHovered;
                }
                return;
            }
            _isCanvasBeingDragged = true;
        });

        this._el.addEventListener('mouseup', e => {
            _isCanvasBeingDragged = false;
            if (_entityBeingDragged) {
                _entityBeingDragged._selected = false;
                _entityBeingDragged = null;
            }
        });

        this._el.addEventListener('click', e => {
            if (_cancelClick) {
                _cancelClick = false;
            } else {
                if (_entityBeingHovered) {
                    _entityBeingHovered.emit('click');
                    _entityBeingHovered._selected = true;
                    this._el.dispatchEvent(_entityBeingHovered.createEvent('clickentity'));
                    if (_selectedEntities.length === 0) {
                        _selectedEntities.push(_entityBeingHovered);
                    } else {
                        _selectedEntities.forEach(selectedEntity => {
                            if (selectedEntity._id !== _entityBeingHovered._id) {
                                _selectedEntities.push(_entityBeingHovered);
                            }
                        });
                    }

                    if (_selectedEntities.length == 2) {
                        let secondSelectedEntity = _selectedEntities.pop();
                        let firstdSelectedEntity = _selectedEntities.pop();

                        //this avoids bidirectional connection
                        let conetionAlreadyExists = false;
                        //verify connection from -> to
                        for (
                            let i = 0; i < firstdSelectedEntity.connections.length; i++
                        ) {
                            let connection =
                                firstdSelectedEntity.connections[i];
                            if (
                                connection.to._id ===
                                secondSelectedEntity._id
                            ) {
                                conetionAlreadyExists = true;
                                break;
                            }
                        }

                        //verify connection to -> from
                        for (
                            let i = 0; i < secondSelectedEntity.connections.length; i++
                        ) {
                            let connection =
                                secondSelectedEntity.connections[i];
                            if (
                                connection.to._id ===
                                firstdSelectedEntity._id
                            ) {
                                conetionAlreadyExists = true;
                                break;
                            }
                        }

                        if (!conetionAlreadyExists) {
                            firstdSelectedEntity.addConnection({
                                to: secondSelectedEntity,
                            });
                        }
                        _selectedEntities = [];
                    }
                    return;
                }
            }

        });

        this._el.addEventListener('mouseout', e => {
            _isCanvasBeingDragged = false;
            _selectedEntities = [];
            _entityBeingDragged = null;
            _cancelClick = false;
        });

        this._el.addEventListener('wheel', e => {
            console.log(e);
            if (e.wheelDelta > 0 || e.deltaY < 0) {
                this.scale = ({
                    horizontal: 1.01,
                    vertical: 1.01,
                });
            } else {
                this.scale = ({
                    horizontal: 0.99,
                    vertical: 0.99,
                });
            }
        });

        let previousTouchEvent = null;
        let previousTouchStartTimestamp = null;
        this._el.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                const ex = e.touches[0].clientX;
                const ey = e.touches[0].clientY;
                const {
                    x,
                    y
                } = this.mousePosition({
                    x: ex,
                    y: ey,
                });
                this._mouse.x = x;
                this._mouse.y = y;

                for (let i = 0; i < this._entityManager.entities.length; i++) {
                    let entity = this._entityManager.entities[i];
                    if (entity.contains(this._mouse.x, this._mouse.y)) {
                        _entityBeingHovered = entity;
                        if (!_entityBeingDragged) {
                            _entityBeingDragged = entity;
                        }
                        this._el.dispatchEvent(
                            entity.createEvent('touchstartentity')
                        );
                        return;
                    }
                }
                _isCanvasBeingDragged = true;

                if (previousTouchStartTimestamp) {
                    console.log(
                        e.timeStamp - previousTouchStartTimestamp.timeStamp
                    );
                    if (
                        e.timeStamp - previousTouchStartTimestamp.timeStamp <=
                        200
                    ) {
                        this._el.dispatchEvent(new CustomEvent('dbtouch', e));
                    }
                }

                previousTouchStartTimestamp = e;
            }
        });

        this._el.addEventListener('touchmove', e => {
            console.log('TOUCH MOVE');
            if (e.touches.length === 1) {
                const ex = e.touches[0].clientX;
                const ey = e.touches[0].clientY;
                const {
                    x,
                    y
                } = this.mousePosition({
                    x: ex,
                    y: ey,
                });
                this._mouse.x = x;
                this._mouse.y = y;
                if (_isCanvasBeingDragged && previousTouchEvent) {
                    const pex = previousTouchEvent.touches[0].clientX;
                    const pey = previousTouchEvent.touches[0].clientY;

                    let previousEventPosition = this.mousePosition({
                        x: pex,
                        y: pey,
                    });

                    let deltaX =
                        (this._mouse.x - previousEventPosition.x) *
                        this._scale.horizontal;
                    let deltaY =
                        (this._mouse.y - previousEventPosition.y) *
                        this._scale.vertical;
                    this.translate(deltaX, deltaY);
                } else {
                    if (_entityBeingDragged) {
                        _cancelClick = true;
                        _entityBeingDragged.position = {
                            x: parseInt(
                                (this._mouse.x - _entityBeingDragged.dimension.width / 2).toFixed(0)
                            ),
                            y: parseInt(
                                (this._mouse.y - _entityBeingDragged.dimension.height / 2).toFixed(0)
                            )
                        };
                    }
                }

                previousTouchEvent = e;
            }
        });

        this._el.addEventListener('touchend', e => {
            if (_entityBeingDragged) {
                _entityBeingDragged = null;
            }
            const ex = e.changedTouches[0].clientX;
            const ey = e.changedTouches[0].clientY;
            const {
                x,
                y
            } = this.mousePosition({
                x: ex,
                y: ey,
            });
            this._mouse.x = x;
            this._mouse.y = y;
            for (let i = 0; i < this._entityManager.entities.length; i++) {
                let entity = this._entityManager.entities[i];
                if (entity.contains(this._mouse.x, this._mouse.y)) {
                    this._el.dispatchEvent(entity.createEvent('touchendentity'));
                }
            }

            _isCanvasBeingDragged = false;

            previousTouchEvent = null;
        });

        this._evCache = [];
        this.prevDiff = -1;

        const pointerdown_handler = ev => {
            this._evCache.push(ev);
        };

        const pointermove_handler = ev => {
            for (var i = 0; i < this._evCache.length; i++) {
                if (ev.pointerId == this._evCache[i].pointerId) {
                    this._evCache[i] = ev;
                    break;
                }
            }

            if (this._evCache.length == 2) {
                var curDiff = Math.abs(
                    this._evCache[0].clientX - this._evCache[1].clientX
                );

                if (this.prevDiff > 0) {
                    if (curDiff > this.prevDiff) {
                        this.scale = ({
                            horizontal: 1.01,
                            vertical: 1.01,
                        });
                    }
                    if (curDiff < this.prevDiff) {
                        this.scale = ({
                            horizontal: 0.99,
                            vertical: 0.99,
                        });
                    }
                }

                this.prevDiff = curDiff;
            }
        };

        const pointerup_handler = ev => {
            remove_event(ev);
            if (this._evCache.length < 2) {
                this.prevDiff = -1;
            }
        };

        const remove_event = ev => {
            for (var i = 0; i < this._evCache.length; i++) {
                if (this._evCache[i].pointerId == ev.pointerId) {
                    this._evCache.splice(i, 1);
                    break;
                }
            }
        };

        this._el.onpointerdown = pointerdown_handler;
        this._el.onpointermove = pointermove_handler;
        this._el.onpointerup = pointerup_handler;
        this._el.onpointercancel = pointerup_handler;
        this._el.onpointerout = pointerup_handler;
        this._el.onpointerleave = pointerup_handler;

        window.addEventListener(
            'resize',
            () => {
                if (this._offscreenCanvas) {
                    this._offscreenCanvas.width = this._el.parentElement.clientWidth;
                    this._offscreenCanvas.height = this._el.parentElement.clientHeight;
                } else {
                    this._el.width = this._el.parentElement.clientWidth;
                    this._el.height = this._el.parentElement.clientHeight;
                }
            },
            false
        );

        this.start();
    }

    clearFrame() {
        this._ctx.clearRect(0, 0, this._el.width, this._el.height);
    }

    translate(dx, dy) {
        this._origin.x += dx;
        this._origin.y += dy;
    }

    start() {
        this._startTime = new Date();
        this._intervalId = setInterval(() => {
            this.tick();
        }, 1000 / this._fps);
    }

    stop() {
        this._startTime = null;
    }

    tick() {
        const deltaTime = new Date() - this._timeToDraw;
        this.update(deltaTime);
        this._timeToUpdate = new Date() - this._timePreviousFrame;
        this.draw();
        this._timeToDraw = new Date() - this._timeToUpdate;
    }

    update(deltaTime) {
        this._entityManager.entities.forEach(entity => {
            entity.update(deltaTime);
        });
    }

    draw() {
        this.clearFrame();
        this._ctx.save();
        this._ctx.translate(this._origin.x + 0.5, this._origin.y + 0.5);
        this._ctx.scale(this._scale.horizontal, this._scale.vertical);
        this._entityManager.entities.forEach(entity => {
            entity.draw(this._ctx);
        });
        this._ctx.restore();
    }

    mousePosition(e) {
        const canvasBoundingRect = this._el.getBoundingClientRect();
        const scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elementOffset = {
            top: canvasBoundingRect.top + scrollTop,
            left: canvasBoundingRect.left + scrollLeft,
        };

        return {
            x: (e.x - this._origin.x - elementOffset.left) / this._scale.horizontal,
            y: (e.y - this._origin.y - elementOffset.top) / this._scale.vertical,
        };
    }

    setData(data) {
        let entityMap = {};
        for (let [name, dataBlock] of Object.entries(data)) {
            let newEntity;
            dataBlock.name = name;
            dataBlock._name = name;
            if (dataBlock.type === 'conditional') {
                newEntity = new Conditional(dataBlock, this);
            } else {
                newEntity = new Block(dataBlock, this);
            }
            entityMap[name] = newEntity;
        }

        for (let [name, dataBlock] of Object.entries(data)) {
            if (dataBlock.connections) {
                dataBlock.connections.forEach(connection => {
                    const connectionTo = entityMap[connection.to];
                    if (connectionTo) {
                        connection.to = connectionTo;
                        entityMap[name].addConnection(connection);
                    }
                });
            }
        }


        Object.values(entityMap).forEach((entity) => {
            this._entityManager.addEntity(entity);
        });
    }

    get data() {
        let data = {};
        const entitiesArray = this._entityManager.entities;
        for (let i = 0; i < entitiesArray.length; i++) {
            const entity = entitiesArray[i];
            const dataEntity = {};
            if (entity instanceof Block) {
                dataEntity.type = 'block';
            } else {
                dataEntity.type = 'conditional';
            }

            Object.keys(entitiesArray[i]).forEach(key => {
                if (key.charAt(0) !== '_') dataEntity[key] = entity[key];
            });

            dataEntity.connections = [];
            for (let j = 0; j < entity.connections.length; j++) {
                let connection = entity.connections[j];
                let dataConnection = {};
                Object.keys(connection).forEach(key => {
                    if (key.charAt(0) !== '_')
                        dataConnection[key] = connection[key];
                });
                dataConnection.to = connection.to.name;
                dataEntity.connections.push(dataConnection);
            }
            data[entity.name] = dataEntity;
        }
    }

    get ctx() {
        return this._ctx;
    }

    get mouse() {
        return this._mouse;
    }

    get entityManager() {
        return this._entityManager;
    }

    set scale(newValue) {
        const newSh = this._scale.horizontal * newValue.horizontal;
        const newSv = this._scale.vertical * newValue.vertical;
        if (
            newSh < this._scaleLimits.max &&
            newSv < this._scaleLimits.max &&
            newSh >= this._scaleLimits.min &&
            newSv >= this._scaleLimits.min
        ) {
            this._scale.horizontal = newSh;
            this._scale.vertical = newSv;
        }
    }

}