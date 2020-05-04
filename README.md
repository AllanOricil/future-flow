![](https://badgen.net/npm/v/future-flow)
![](https://badgen.net/npm/dt/future-flow)
![](https://badgen.net/npm/dependents/future-flow)
![](https://badgen.net/bundlephobia/min/future-flow)

# Future Flow

This project aims to be a simple Flow generator using HTML5 Canvas.

[DEMO](https://naughty-dijkstra-92979d.netlify.app)

## Features:

-   [x] Import Flow using JS Object or JSON
-   [x] Zoom
-   [x] Pan
-   [x] Customize Block layout using properties
-   [ ] Mobile Ready - In Progress
-   [ ] Customize Connections
-   [ ] Export Flow as JSON or JS Object
-   [ ] Allow creation of personalized Blocks
-   [ ] Export Flow as Image
-   [ ] Animations

## How to Install

Using NPM

```terminal
npm i future-flow
```

Using CDN

```html
<script src="https://unpkg.com/future-flow@0.0.1-5/lib/index.min.js"></script>
```

## Example

```html
<html>
    <head>
        <script src="https://unpkg.com/future-flow@0.0.1-5/lib/index.min.js"></script>
    </head>
    <body>
        <canvas id="canvas"></canvas>
    </body>

    <script>
        startFutureFlow()

        const startFutureFlow = () => {
            const el = document.getElementById('canvas')

            const options = {
                background: {
                    color: 'rgb(255,255,255)',
                },
                fps: 60,
                zoom: {
                    level: 1,
                    max: 2,
                    min: 0.2,
                },
                isDebugging: false,
                drawOrigin: true,
                editor: false,
                canMoveBlocks: true,
                autoArrange: false,
            }

            const data = {
                a: {
                    x: 50,
                    y: 50,
                    isDraggable: true,
                    connections: ['b', 'c'],
                    background: {
                        color: 'rgb(255,255,255)',
                    },
                    border: {
                        radius: 10,
                        normal: {
                            width: 2,
                            color: 'rgb(0,0,0,0.2)',
                        },
                        selected: {
                            width: 2,
                            color: 'black',
                        },
                        hover: {
                            width: 2,
                            color: 'black',
                        },
                    },
                    shadow: {
                        color: 'rgba(0,0,0,0.2)',
                        blur: 6,
                        offset: {
                            x: 5,
                            y: 5,
                        },
                    },
                    header: {
                        text: 'lor sit amet orci efficitur',
                        alignment: 'start',
                        divider: {
                            width: 1,
                            color: 'rgba(0,0,0,0.2)',
                        },
                        font: {
                            family: 'Arial',
                            style: 'normal',
                            variant: 'normal',
                            color: 'rgba(0,0,0,0.6)',
                            size: 20,
                            weight: 'bold',
                        },
                    },
                    body: {
                        text:
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at consectetur lorem. Etiam dignissim dolor sit amet orci efficitur auctor.',
                        alignment: 'start',
                        divider: {
                            width: 1,
                            color: 'rgba(0,0,0,0.2)',
                        },
                        font: {
                            family: 'Arial',
                            style: 'normal',
                            variant: 'normal',
                            color: 'rgba(0,0,0,0.6)',
                            size: 20,
                            weight: 'bold',
                        },
                    },
                    footer: {
                        text: 'lor sit amet orci efficitur',
                        alignment: 'start',
                        divider: {
                            width: 1,
                            color: 'rgba(0,0,0,0.2)',
                        },
                        font: {
                            family: 'Arial',
                            style: 'normal',
                            variant: 'normal',
                            color: 'rgba(0,0,0,0.6)',
                            size: 20,
                            weight: 'bold',
                        },
                    },
                },
                b: {
                    x: 400,
                    y: 400,
                    isDraggable: true,
                    connections: ['c'],
                    header: {
                        text: 'Header',
                        alignment: 'start',
                        font: {
                            family: 'Arial',
                            style: 'normal',
                            variant: 'normal',
                            color: 'rgba(0,0,0,0.6)',
                            size: 20,
                            weight: 'bold',
                        },
                        icon: './bell.svg',
                    },
                    body: {
                        text: 'Body',
                        alignment: 'start',
                        font: {
                            family: 'Arial',
                            style: 'normal',
                            variant: 'normal',
                            color: 'rgba(0,0,0,0.6)',
                            size: 20,
                            weight: 'bold',
                        },
                    },
                    footer: {
                        text: 'Footer',
                        alignment: 'start',
                        font: {
                            family: 'Arial',
                            style: 'normal',
                            variant: 'normal',
                            color: 'rgba(0,0,0,0.6)',
                            size: 20,
                            weight: 'bold',
                        },
                    },
                },
                c: {
                    x: 700,
                    y: 800,
                    connections: ['a'],
                },
            }

            const canvas = new Canvas(el, {
                w: window.innerWidth,
                h: window.innerHeight,
                options,
                data,
            })
        }
    </script>
</html>
```

## Block Properties

When initializing Future Flow you have to pass the Options and Data JS Objects.
Inside the Data Object each key represents a block, and each value is the block's configuration.
The key is also the Name of the Block and it is used to create a Connection. In the example below, block "a" will
connect with blocks "b" and "c". If the block name written in the connections array does not exist, the connections won't be created.

```javascript
const data = {
    a: {
        x: 50,
        y: 50,
        isDraggable: true,
        connections: ['b', 'c'],
        background: {
            color: 'rgb(255,255,255)',
        },
        border: {
            radius: 10,
            normal: {
                width: 2,
                color: 'rgb(0,0,0,0.2)',
            },
            selected: {
                width: 2,
                color: 'black',
            },
            hover: {
                width: 2,
                color: 'black',
            },
        },
        shadow: {
            color: 'rgba(0,0,0,0.2)',
            blur: 6,
            offset: {
                x: 5,
                y: 5,
            },
        },
        header: {
            text: 'lor sit amet orci efficitur',
            alignment: 'start',
            divider: {
                width: 1,
                color: 'rgba(0,0,0,0.2)',
            },
            font: {
                family: 'Arial',
                style: 'normal',
                variant: 'normal',
                color: 'rgba(0,0,0,0.6)',
                size: 20,
                weight: 'bold',
            },
        },
        body: {
            text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at consectetur lorem. Etiam dignissim dolor sit amet orci efficitur auctor.',
            alignment: 'start',
            divider: {
                width: 1,
                color: 'rgba(0,0,0,0.2)',
            },
            font: {
                family: 'Arial',
                style: 'normal',
                variant: 'normal',
                color: 'rgba(0,0,0,0.6)',
                size: 20,
                weight: 'bold',
            },
        },
        footer: {
            text: 'lor sit amet orci efficitur',
            alignment: 'start',
            divider: {
                width: 1,
                color: 'rgba(0,0,0,0.2)',
            },
            font: {
                family: 'Arial',
                style: 'normal',
                variant: 'normal',
                color: 'rgba(0,0,0,0.6)',
                size: 20,
                weight: 'bold',
            },
        },
    },
}
```

## Pictures

![simple-flow](/images/simple_flow.JPG)
