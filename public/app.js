System.register("utils/misc", [], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_1("isVisible", isVisible);
    function adjust(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_1("adjust", adjust);
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports_1("getRandomElement", getRandomElement);
    return {
        setters: [],
        execute: function () {
        }
    };
});
// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
System.register("utils/Random", [], function (exports_2, context_2) {
    var __moduleName = context_2 && context_2.id;
    var MAX_INT32, MINSTD, Random;
    return {
        setters: [],
        execute: function () {// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
            MAX_INT32 = 2147483647;
            MINSTD = 16807;
            Random = class Random {
                constructor(seed) {
                    if (!Number.isInteger(seed)) {
                        throw new TypeError("Expected `seed` to be a `integer`");
                    }
                    this.seed = seed % MAX_INT32;
                    if (this.seed <= 0) {
                        this.seed += (MAX_INT32 - 1);
                    }
                }
                next() {
                    return this.seed = this.seed * MINSTD % MAX_INT32;
                }
                nextFloat() {
                    return (this.next() - 1) / (MAX_INT32 - 1);
                }
            };
            exports_2("Random", Random);
        }
    };
});
System.register("main", [], function (exports_3, context_3) {
    var __moduleName = context_3 && context_3.id;
    function drawLine(x1, y1, x2, y2) {
        _drawLine(x1 % width, y1, x2 % width, y2, leftColor);
        _drawLine(x1 % width + width, y1, x2 % width + width, y2, rightColor);
    }
    function _drawLine(x1, y1, x2, y2, color) {
        ctx.strokeStyle = color;
        ctx.lineJoin = "round";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
    }
    var canvas, ctx, width, mousePressed, PaletteCell, padding, colors, cells, leftColor, rightColor, lastX, lastY;
    return {
        setters: [],
        execute: function () {
            canvas = document.getElementById("canvas");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx = canvas.getContext("2d");
            width = canvas.width / 2;
            mousePressed = false;
            PaletteCell = class PaletteCell {
                constructor(x, y, c) {
                    this.color = c;
                    this.position = { x, y };
                }
                isHover(x, y) {
                    return (x >= this.position.x && x <= this.position.x + PaletteCell.size
                        && y >= this.position.y && y <= this.position.y + PaletteCell.size);
                }
                draw(context, side) {
                    context.fillStyle = this.color;
                    context.strokeStyle = "black";
                    let x = this.position.x + (!side ? 0 : width);
                    context.fillRect(x, this.position.y, PaletteCell.size, PaletteCell.size);
                    context.strokeRect(x, this.position.y, PaletteCell.size, PaletteCell.size);
                }
            };
            PaletteCell.size = 50;
            padding = 10;
            colors = ["yellow", "red", "cyan", "lightgreen", "green", "lightsteelblue", "blue", "black", "white"];
            cells = colors.map((c, i) => new PaletteCell(padding + i * (PaletteCell.size + 10), padding, c));
            for (let c of cells) {
                c.draw(ctx, 0);
                c.draw(ctx, 1);
            }
            leftColor = 'green';
            rightColor = leftColor;
            lastX = 0;
            lastY = 0;
            canvas.addEventListener("mousedown", e => {
                let x = e.offsetX;
                let y = e.offsetY;
                let cell = cells.find(c => c.isHover(x, y));
                if (cell) {
                    if (e.button === 0) {
                        leftColor = cell.color;
                    }
                    return;
                }
                mousePressed = true;
                drawLine(x, y, x + 1, y + 1);
                lastX = x;
                lastY = y;
            });
            canvas.addEventListener("mousemove", e => {
                if (mousePressed) {
                    let x = e.offsetX;
                    let y = e.offsetY;
                    drawLine(lastX, lastY, x, y);
                    lastX = x;
                    lastY = y;
                }
            });
            canvas.addEventListener("mouseup", e => {
                let x = e.offsetX;
                let y = e.offsetY;
                let cell = cells.find(c => c.isHover(x, y));
                if (cell) {
                    if (e.button === 0) {
                        rightColor = cell.color;
                    }
                    return;
                }
                mousePressed = false;
            });
        }
    };
});
System.register("utils/imageData", [], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    function setPixelI(imageData, i, r, g, b, a = 1) {
        // tslint:disable-next-line:no-bitwise
        const offset = i << 2;
        imageData.data[offset + 0] = r;
        imageData.data[offset + 1] = g;
        imageData.data[offset + 2] = b;
        imageData.data[offset + 3] = a;
    }
    exports_4("setPixelI", setPixelI);
    function scaleNorm(v) {
        return Math.floor(v * almost256);
    }
    function setPixelNormI(imageData, i, r, g, b, a = 1) {
        setPixelI(imageData, i, scaleNorm(r), scaleNorm(g), scaleNorm(b), scaleNorm(a));
    }
    exports_4("setPixelNormI", setPixelNormI);
    function setPixelXY(imageData, x, y, r, g, b, a = 255) {
        setPixelI(imageData, y * imageData.width + x, r, g, b, a);
    }
    exports_4("setPixelXY", setPixelXY);
    function setPixelNormXY(imageData, x, y, r, g, b, a = 1) {
        setPixelNormI(imageData, y * imageData.width + x, r, g, b, a);
    }
    exports_4("setPixelNormXY", setPixelNormXY);
    var almost256;
    return {
        setters: [],
        execute: function () {
            almost256 = 256 - Number.MIN_VALUE;
        }
    };
});
//# sourceMappingURL=app.js.map