import Entity from './entity.js';
import Padding from '../styles/padding.js';
import Font from '../styles/font.js';
import Icon from './icon.js';
import Rectangle from '../shapes/rectangle.js';

export default class Block extends Entity {
    constructor({
        position,
        name,
        isDraggable,
        background,
        shadow,
        border,
        header,
        body,
        padding,
        footer,
        state,
        states,
    }, canvas) {
        super({
            name,
            position,
            padding
        }, canvas);

        this.isDraggable = isDraggable || false;
        this.states = states || [];
        this.state = state;

        if (header) {
            this._header = header;
            this._header.font = new Font(header.font);
            this._header.padding = header.padding ? new Padding(header.padding) : Entity.PADDING;
            this._header.icon = header.icon ? new Icon({
                src: header.icon.src,
                parent: this,
                position: header.icon.position || {
                    x: 0,
                    y: 0
                },
                padding: header.icon.padding || Entity.PADDING,
                dimension: {
                    width: 25,
                    height: 25
                }
            }) : {
                parent: this,
                position: {
                    x: 0,
                    y: 0
                },
                padding: {
                    top: 15,
                    right: 15,
                    bottom: 15,
                    left: 15,
                },
                dimension: {
                    width: 25,
                    height: 25
                }
            };
        }

        if (body) {
            this._body = body;
            this._body.font = new Font(body.font);
            this._body.padding = body.padding ? new Padding(body.padding) : Entity.PADDING;
        }

        if (footer) {
            this._footer = footer;
            this._footer.font = new Font(footer.font);
            this._footer.padding = footer.padding ? new Padding(footer.padding) : Entity.PADDING;
        }

        this._shape = new Rectangle({
            position: this.position,
            dimension: this.dimension,
            shadow,
            border,
            background
        });

        this.on('mouseenter', () => {
            this._hover = true;
        });

        this.on('mouseleave', () => {
            this._hover = false;
        });
    }

    draw(ctx) {
        this._shape.draw(ctx);

        //HEADER
        let headerHeight = 0;
        let headerWidth = 0;
        if (this._header) {
            ctx.textBaseline = 'top';
            ctx.font = `${this._header.font.style} ${this._header.font.variant} ${this._header.font.weight} ${this._header.font.size}px ${this._header.font.family}`;
            ctx.fillStyle = this._header.font.color.hex;
            ctx.textAlign = this._header.alignment;

            let headerTextY;
            if (this._header.icon && this._header.font.dimensions.ascent < this._header.icon.dimension.height) {
                headerHeight =
                    this._header.icon.padding.top +
                    this._header.icon.dimension.height +
                    this._header.icon.padding.bottom;
                headerTextY = (headerHeight - this._header.font.dimensions.ascent) / 2;
            } else {
                headerHeight =
                    this._header.padding.top +
                    this._header.font.dimensions.ascent +
                    this._header.padding.bottom;
                headerTextY = this._header.padding.top;
            }

            let headerTextX = 0;
            if (this._header.alignment === 'center') {
                headerTextX = this.position.x + (this.dimension.width) / 2;
            } else {
                if (this._header.icon) {
                    headerTextX = this.position.x + this._header.icon.dimension.width + this._header.icon.padding.left + this._header.icon.padding.right + this._header.padding.left;
                } else {
                    headerTextX = this.position.x + this._header.padding.left;
                }
            }

            ctx.fillText(this._header.text, headerTextX, this.position.y + headerTextY);

            if (this._header.divider) {
                ctx.save();
                ctx.strokeStyle = this._header.divider.color;
                ctx.lineWidth = this._header.divider.width;
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y + headerHeight);
                ctx.lineTo(this.position.x + this.dimension.width, this.position.y + headerHeight);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }


            headerWidth = this._header.icon.dimension.width + this._header.icon.padding.left + this._header.icon.padding.right + ctx.measureText(this._header.text).width + this._header.padding.left + this._header.padding.right;

            if (this._header.icon && this._header.icon.loaded) {
                this._header.icon.draw(ctx);
            }
        }

        //BODY
        let bodyHeight = 0;
        let bodyWidth = 0;
        if (this._body) {
            ctx.save();
            ctx.font = this._body.font.font2Canvas;
            ctx.fillStyle = this._body.font.color.hex;
            ctx.textAlign = this._body.alignment;
            ctx.textBaseline = 'top';
            let lines = [];
            const tokens = this._body.text.split(' ');
            let currentLineIndex = 0;
            tokens.forEach(token => {
                const tokenWidth = ctx.measureText(token).width;
                const currentLineWidth = ctx.measureText(
                    lines[currentLineIndex] || ''
                ).width;
                if (
                    this._body.padding.left +
                    currentLineWidth +
                    tokenWidth +
                    this._body.padding.right >
                    Entity.MAX_WIDTH
                ) {
                    currentLineIndex++;
                }
                let currentLineText = lines[currentLineIndex] || '';
                lines[currentLineIndex] = currentLineText +=
                    (currentLineText.length > 0 ? ' ' : '') + token;
            });

            lines.forEach((line, index) => {
                const lineTextY =
                    this.position.y +
                    headerHeight +
                    this._body.font.dimensions.height * index +
                    this._body.padding.top;

                ctx.fillText(line, this.position.x + this._body.padding.left, lineTextY);

                const lineWidth = ctx.measureText(line).width;
                bodyWidth = lineWidth > bodyWidth ? lineWidth : bodyWidth;
            });
            bodyHeight =
                this._body.padding.top +
                lines.length * this._body.font.dimensions.height +
                this._body.padding.bottom;

            bodyWidth += this._body.padding.left + this._body.padding.right;
            ctx.restore();
        }

        //FOOTER
        let footerHeight = 0;
        let footerWidth = 0;
        if (this._footer) {
            if (this._footer.divider) {
                ctx.save();
                ctx.strokeStyle = this._footer.divider.color;
                ctx.lineWidth = this._footer.divider.width;
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y + headerHeight + bodyHeight);
                ctx.lineTo(this.position.x + this.dimension.width, this.position.y + headerHeight + bodyHeight);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }

            ctx.textBaseline = 'top';
            ctx.font = `${this._footer.font.style} ${this._footer.font.variant} ${this._footer.font.weight} ${this._footer.font.size}px ${this._footer.font.family}`;
            ctx.fillStyle = this._footer.font.color.hex;
            ctx.textAlign = this._footer.alignment;
            ctx.alignment = 'top';

            ctx.fillText(
                this._footer.text,
                this.position.x + this._footer.padding.left,
                this.position.y + headerHeight + bodyHeight + this._footer.padding.top
            );
            footerHeight =
                this._footer.padding.top +
                this._footer.font.dimensions.height +
                this._footer.padding.bottom;
            footerWidth =
                this._footer.padding.left +
                ctx.measureText(this._footer.text).width +
                this._footer.padding.right;
        }

        //CALCULATES BLOCK'S WIDTH AND HEIGHT
        const calculatedWidth =
            (headerWidth > bodyWidth && headerWidth > footerWidth ?
                headerWidth :
                bodyWidth > footerWidth ?
                bodyWidth :
                footerWidth).toFixed(0);

        const calculatedHeight = (headerHeight + bodyHeight + footerHeight).toFixed(0);

        this.dimension.width = parseInt(calculatedWidth);
        this.dimension.height = parseInt(calculatedHeight);

        this.connections.forEach(connection => {
            connection.draw(ctx);
        });
    }


    get header(){
        return this._header;
    }

    get footer(){
        return this._footer;
    }

    get body(){
        return this._body;
    }
}