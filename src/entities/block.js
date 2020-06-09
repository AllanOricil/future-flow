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
            this.header = header;
            this.header.font = new Font(header.font);
            this.header.padding = header.padding ? new Padding(header.padding) : Entity.PADDING;
            this.header.icon = header.icon ? new Icon({
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
            this.body = body;
            this.body.font = new Font(body.font);
            this.body.padding = body.padding ? new Padding(body.padding) : Entity.PADDING;
        }

        if (footer) {
            this.footer = footer;
            this.footer.font = new Font(footer.font);
            this.footer.padding = footer.padding ? new Padding(footer.padding) : Entity.PADDING;
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
        if (this.header) {
            ctx.textBaseline = 'top';
            ctx.font = `${this.header.font.style} ${this.header.font.variant} ${this.header.font.weight} ${this.header.font.size}px ${this.header.font.family}`;
            ctx.fillStyle = this.header.font.color.hex;
            ctx.textAlign = this.header.alignment;

            let headerTextY;
            if (this.header.icon && this.header.font.dimensions.ascent < this.header.icon.dimension.height) {
                headerHeight =
                    this.header.icon.padding.top +
                    this.header.icon.dimension.height +
                    this.header.icon.padding.bottom;
                headerTextY = (headerHeight - this.header.font.dimensions.ascent) / 2;
            } else {
                headerHeight =
                    this.header.padding.top +
                    this.header.font.dimensions.ascent +
                    this.header.padding.bottom;
                headerTextY = this.header.padding.top;
            }

            let headerTextX = 0;
            if (this.header.alignment === 'center') {
                headerTextX = this.position.x + (this.dimension.width) / 2;
            } else {
                if (this.header.icon) {
                    headerTextX = this.position.x + this.header.icon.dimension.width + this.header.icon.padding.left + this.header.icon.padding.right + this.header.padding.left;
                } else {
                    headerTextX = this.position.x + this.header.padding.left;
                }
            }

            ctx.fillText(this.header.text, headerTextX, this.position.y + headerTextY);

            if (this.header.divider) {
                ctx.save();
                ctx.strokeStyle = this.header.divider.color;
                ctx.lineWidth = this.header.divider.width;
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y + headerHeight);
                ctx.lineTo(this.position.x + this.dimension.width, this.position.y + headerHeight);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }


            headerWidth = this.header.icon.dimension.width + this.header.icon.padding.left + this.header.icon.padding.right + ctx.measureText(this.header.text).width + this.header.padding.left + this.header.padding.right;

            if (this.header.icon && this.header.icon.loaded) {
                this.header.icon.draw(ctx);
            }
        }

        //BODY
        let bodyHeight = 0;
        let bodyWidth = 0;
        if (this.body) {
            ctx.save();
            ctx.font = this.body.font.font2Canvas;
            ctx.fillStyle = this.body.font.color.hex;
            ctx.textAlign = this.body.alignment;
            ctx.textBaseline = 'top';
            let lines = [];
            const tokens = this.body.text.split(' ');
            let currentLineIndex = 0;
            tokens.forEach(token => {
                const tokenWidth = ctx.measureText(token).width;
                const currentLineWidth = ctx.measureText(
                    lines[currentLineIndex] || ''
                ).width;
                if (
                    this.body.padding.left +
                    currentLineWidth +
                    tokenWidth +
                    this.body.padding.right >
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
                    this.body.font.dimensions.height * index +
                    this.body.padding.top;

                ctx.fillText(line, this.position.x + this.body.padding.left, lineTextY);

                const lineWidth = ctx.measureText(line).width;
                bodyWidth = lineWidth > bodyWidth ? lineWidth : bodyWidth;
            });
            bodyHeight =
                this.body.padding.top +
                lines.length * this.body.font.dimensions.height +
                this.body.padding.bottom;

            bodyWidth += this.body.padding.left + this.body.padding.right;
            ctx.restore();
        }

        //FOOTER
        let footerHeight = 0;
        let footerWidth = 0;
        if (this.footer) {
            if (this.footer.divider) {
                ctx.save();
                ctx.strokeStyle = this.footer.divider.color;
                ctx.lineWidth = this.footer.divider.width;
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y + headerHeight + bodyHeight);
                ctx.lineTo(this.position.x + this.dimension.width, this.position.y + headerHeight + bodyHeight);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }

            ctx.textBaseline = 'top';
            ctx.font = `${this.footer.font.style} ${this.footer.font.variant} ${this.footer.font.weight} ${this.footer.font.size}px ${this.footer.font.family}`;
            ctx.fillStyle = this.footer.font.color.hex;
            ctx.textAlign = this.footer.alignment;
            ctx.alignment = 'top';

            ctx.fillText(
                this.footer.text,
                this.position.x + this.footer.padding.left,
                this.position.y + headerHeight + bodyHeight + this.footer.padding.top
            );
            footerHeight =
                this.footer.padding.top +
                this.footer.font.dimensions.height +
                this.footer.padding.bottom;
            footerWidth =
                this.footer.padding.left +
                ctx.measureText(this.footer.text).width +
                this.footer.padding.right;
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
}