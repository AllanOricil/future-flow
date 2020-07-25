import Entity from '../core/entity.js';
import Font from '../styles/font.js';
import Padding from '../styles/padding.js';
import Diamond from '../shapes/diamond.js';
export default class Conditional extends Entity {
    constructor({
        position,
        name,
        isDraggable,
        background,
        shadow,
        border,
        body,
        state,
        states,
    }, canvas) {
        super({
            name,
            position
        }, canvas);
        this.isDraggable = isDraggable || false;
        this.states = states || [];
        this.state = state;

        if (body) {
            this.body = body;
            this.body.font = new Font(body.font);
            this.body.padding = body.padding ? new Padding(body.padding) : Entity.PADDING;
        }

        this._shape = new Diamond({
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
        //DRAW THE SHAAPE
        this._shape.draw(ctx);

        //BODY
        let bodyHeight = 0;
        let bodyWidth = 0;
        if (this.body) {
            ctx.save();
            ctx.font = `${this.body.font.style} ${this.body.font.variant} ${this.body.font.weight} ${this.body.font.size}px ${this.body.font.family}`;
            ctx.fillStyle = this.body.font.color.hex;
            ctx.textAlign = this.body.alignment;
            ctx.textBaseline = 'top';

            const regex = new RegExp('\r\n', 'gi');
            //first break into lines
            let linesToDraw = [];
            const lineTokens = this.body.text.split(regex);
            lineTokens.forEach((lineToken, index) => {
                if (index != 0)
                    linesToDraw.push('');
                //then break into tokens and calculate how many tokens per line until a new line is formed
                const tokens = lineToken.split(' ');
                let lines = [];
                let currentLineIndex = 0;
                tokens.forEach((token) => {
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
                linesToDraw.push(lines);
            });
            let index = 0;
            linesToDraw.forEach((line) => {
                const lineWidth = ctx.measureText(line).width;
                const lineTextX = this.position.x + (this.dimension.width - lineWidth) / 2;
                const lineTextY = this.position.y + (this.dimension.height - (this.body.font.dimensions.height * linesToDraw.length) / 2) / 2;
                if (line !== '') {
                    ctx.fillText(line, lineTextX, lineTextY + this.body.font.dimensions.height * index);
                    index++;
                }
                bodyWidth = lineWidth > bodyWidth ? lineWidth : bodyWidth;
            });
            ctx.restore();
            bodyHeight =
                this.body.padding.top +
                linesToDraw.length * this.body.font.dimensions.height +
                this.body.padding.bottom;

            bodyWidth += this.body.padding.left + this.body.padding.right;
        }

        this.dimension.width = parseInt(bodyWidth.toFixed(0)) + bodyHeight / 2;
        this.dimension.height = parseInt(bodyHeight.toFixed(0)) + bodyWidth / 2;
        this.connections.forEach(connection => {
            connection.draw(ctx);
        });
    }
}