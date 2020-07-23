import {
    getBezierPoints,
    getPathPointsGivenPath,
} from '../utils/path.js';
import Connector from './connector.js';
import Line from '../styles/line.js';
import Position from '../transforms/position.js';

export default class Connection {
    static FLOW_SPEED() {
        return 1;
    }
    static FLOW_TYPE() {
        return 'circle';
    }
    static PARTICLE_FILL_COLOR() {
        return 'rgb(212, 212, 212)';
    }
    static FLOW_PARTICLE_DISTANCE() {
        return 5;
    }

    constructor({
        from,
        to,
        line,
        connector,
        isEditable,
        animation,
        showPathPoints,
    }) {
        this._from = from;
        this._to = to;
        this.line = new Line(line);
        connector.position = to.position;
        this._connector = new Connector(connector);
        this.isEditable = isEditable;
        this._particles = [];
        this._animationStarted = false;
        this._flow = true;
        this.showPathPoints = false;
        this._oldToDimensions = {
            width: this._to._width,
            height: this._to._height,
        };
        this._oldFromDimensions = {
            width: this._from.width,
            height: this._from.height,
        };
        this._pathPoints = [];
        if (animation)
            this.animation = {
                speed: animation.speed || Connection.FLOW_SPEED(),
                fillColor: animation.fillColor || Connection.PARTICLE_FILL_COLOR(),
                type: animation.type || Connection.FLOW_TYPE(),
                particleDistance: animation.particleDistance ||
                    Connection.FLOW_PARTICLE_DISTANCE(),
            };
    }

    get connectionPoints() {
        let smallerDistance = Infinity;
        let closestPoints = {};

        for (let [fromKey, fromValue] of Object.entries(this._from.shape.sides)) {
            for (let [toKey, toValue] of Object.entries(this._to.shape.sides)) {
                const distance = Math.sqrt(
                    Math.pow(fromValue.x - toValue.x, 2) +
                    Math.pow(fromValue.y - toValue.y, 2)
                );

                if (distance < smallerDistance) {
                    smallerDistance = distance;
                    fromValue.name = fromKey;
                    toValue.name = toKey;
                    closestPoints = {
                        origin: fromValue,
                        destination: toValue
                    };
                }
            }
        }
        return closestPoints;
    }

    createPath() {
        const connectionPoints = this.connectionPoints;
        const origin = connectionPoints.origin;
        const destination = connectionPoints.destination;

        let hd = Math.abs(destination.x - origin.x);
        let vd = Math.abs(destination.y - origin.y);
        let mhd = hd / 2;
        let mvd = vd / 2;

        let path = [];

        if (
            (origin.name === 'left' && destination.name === 'right') ||
            (origin.name === 'right' && destination.name === 'left')
        ) {
            if (origin.x > destination.x) mhd *= -1;
            path.push({
                x: origin.x,
                y: origin.y,
            }, {
                x: origin.x + mhd,
                y: origin.y,
            }, {
                x: destination.x - mhd,
                y: destination.y,
            }, {
                x: destination.x,
                y: destination.y,
            });
        } else if (
            (origin.name === 'bottom' || origin.name === 'top') &&
            (destination.name === 'right' || destination.name === 'left')
        ) {
            path.push({
                x: origin.x,
                y: origin.y,
            }, {
                x: origin.x,
                y: destination.y,
            }, {
                x: destination.x,
                y: destination.y,
            });
        } else if (
            (origin.name === 'right' || origin.name === 'left') &&
            (destination.name === 'top' || destination.name === 'bottom')
        ) {
            path.push({
                x: origin.x,
                y: origin.y,
            }, {
                x: destination.x,
                y: origin.y,
            }, {
                x: destination.x,
                y: destination.y,
            });
        } else if (
            (origin.name === 'top' && destination.name === 'bottom') ||
            (origin.name === 'bottom' && destination.name === 'top')
        ) {
            if (origin.y > destination.y) mvd *= -1;
            path.push({
                x: origin.x,
                y: origin.y,
            }, {
                x: origin.x,
                y: origin.y + mvd,
            }, {
                x: destination.x,
                y: destination.y - mvd,
            }, {
                x: destination.x,
                y: destination.y,
            });
        }
        return path;
    }

    draw(ctx) {
        let path = this.createPath();
        if (path.length > 0) {
            ctx.save();
            ctx.lineWidth = this.line.weight;
            ctx.strokeStyle = this.line.color.hex;
            ctx.setLineDash(this.line.dashed);
            ctx.lineWidth = this.line.weight;
            ctx.lineCap = 'square';
            ctx.beginPath();
            const startPoint = path[0];
            ctx.moveTo(startPoint.x, startPoint.y);
            if (this.line && this.line.enableBezierCurves) {
                if (path.length === 3) {
                    const controlPoint = path[1];
                    const endPoint = path[2];
                    this._pathPoints = getBezierPoints({
                        startPoint,
                        controlPoint1: controlPoint,
                        endPoint,
                    });
                    ctx.quadraticCurveTo(
                        controlPoint.x,
                        controlPoint.y,
                        endPoint.x,
                        endPoint.y
                    );
                } else {
                    const controlPoint1 = path[1];
                    const controlPoint2 = path[2];
                    const endPoint = path[3];
                    this._pathPoints = getBezierPoints({
                        startPoint,
                        controlPoint1,
                        controlPoint2,
                        endPoint,
                    });
                    ctx.bezierCurveTo(
                        controlPoint1.x,
                        controlPoint1.y,
                        controlPoint2.x,
                        controlPoint2.y,
                        endPoint.x,
                        endPoint.y
                    );
                }
            } else {
                this._pathPoints = getPathPointsGivenPath(path);
                for (let i = 1; i < path.length; i++) {
                    const point = path[i];
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
            ctx.closePath();
            ctx.restore();


            if (this.showPathPoints && this._pathPoints.length) {
                ctx.save();
                ctx.fillStyle = 'red';
                for (let i = 0; i < this._pathPoints.length - 1; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        this._pathPoints[i].x,
                        this._pathPoints[i].y,
                        1,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
                ctx.restore();
            }

            ctx.save();
            if (this.animation && this._animationStarted) {
                if (this._particles.length === 0) {
                    this.addParticle();
                }

                for (let i = 0; i < this._particles.length; i++) {
                    let particle = this._particles[i];
                    if (this._pathPoints.length) {
                        if (
                            particle.toIndex >
                            this.animation.particleDistance &&
                            !particle.addedParticle &&
                            this._flow
                        ) {
                            this.addParticle();
                            particle.addedParticle = true;
                        }

                        particle.toIndex++;
                        if (particle.toIndex >= this._pathPoints.length) {
                            this.removeParticle();
                        } else {
                            particle.x = particle.to.x;
                            particle.y = particle.to.y;
                            particle.to = this._pathPoints[particle.toIndex];
                        }
                    }

                    ctx.beginPath();
                    ctx.fillStyle = this.animation.fillColor;
                    ctx.moveTo(particle.x, particle.y);
                    if (this.animation.type === 'circle')
                        ctx.arc(particle.x, particle.y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.closePath();
                }
            }
            ctx.restore();

            //draw connector
            const lastPoint = path[path.length - 1];
            const secondLastPoint = path[path.length - 2];
            const delta_x = lastPoint.x - secondLastPoint.x;
            const delta_y = lastPoint.y - secondLastPoint.y;
            this._connector.shape.rotation = Math.atan2(delta_y, delta_x);
            this._connector.shape.position = lastPoint;
            this._connector.draw(ctx);
        }
    }

    addParticle() {
        this._particles.push({
            x: this._pathPoints[0].x,
            y: this._pathPoints[0].y,
            toIndex: 1,
            to: this._pathPoints[1],
            addedParticle: false,
        });
    }

    removeParticle() {
        this._particles.splice(0, 1);
    }

    startAnimation() {
        this._animationStarted = true;
    }

    stopAnimation() {
        this._particles = [];
        this._animationStarted = false;
    }

    restartAnimation() {
        this.stopAnimation();
        this.startAnimation();
    }

    stopFlow() {
        this._flow = false;
    }

    get to() {
        return this._to;
    }

    get from() {
        return this._from;
    }

}