let charCodes = {
    ' ': ' '.charCodeAt(0),
    dot: '.'.charCodeAt(0),
    newLine: '\n'.charCodeAt(0),
    nbsp: 255
};
let colors = {
    black: 'black',
    red: 'red',
    aliceblue: 'aliceblue',
    gray: 'gray'
};

let buffer = {
    create: (width, height) => {
        let size = width * height;
        let b = {
            width: width,
            height: height,
            size: size,
            chars: new Array(size),
            foreColors: new Array(size),
            backColors: new Array(size)       
        };
        buffer.clear(b);
        return b;
    },
    toHtml: (b) => {
        let s = `<span style=\'color:${b.foreColors[0]}; background:${b.backColors[0]}\'>`;

        let temp = [b.chars[0]];
        let flush = () => {
            let s = String.fromCharCode(...temp);
            while(temp.pop() !== void 0);
            return s;
        };

        for (let i = 1; i < b.size; i++) {
            if (i % b.width === 0) {
                s += flush();
                s += '<br>';
            }

            if (b.foreColors[i] == b.foreColors[i-1] && b.backColors[i] == b.backColors[i-1]) {
                temp.push(b.chars[i]);
            } else {
                s += flush();
                s += '</span>';
                s += `<span style=\'color:${b.foreColors[i]}; background:${b.backColors[i]}\'>`;
                temp.push(b.chars[i]);
            }
        }

        s += flush();
        s += '</span>';
        return s;
    },
    clear: (b, foreColor, backColor) => {
        for (let i = 0; i < b.size; i++) {
            b.chars[i] = charCodes.dot;
            b.foreColors[i] = foreColor;
            b.backColors[i] = backColor
        }
    },
    writeAt: (b, x, y, char, fore, back) => {
        let index = y * b.width + x; 
        b.chars[index] = typeof char === 'string' ? char.charCodeAt(0) : char;
        b.foreColors[index] = fore || b.foreColors[index];
        b.backColors[index] = back || b.backColors[index];
    },
    writeLine: (b, x, y, string, fore, back) => {
        for (let i = 0; i < string.length; i++) {
            buffer.writeAt(b, x + i, y, string[i], fore, back);
        }
    }
};

window.onload = () => {
    let canvas = document.createElement('div');
    document.body.appendChild(canvas);
    canvas.style.fontFamily = 'monospace';
    
    let b = buffer.create(80, 25);
    buffer.clear(b, colors.gray, colors.black);
    canvas.innerHTML += buffer.toHtml(b);

    let x = Math.floor(b.width / 2 - 'ASCII'.length / 2);
    let y = -1;
    setInterval(function on() {
        y++; if (y >= b.height) y = 0;

        buffer.clear(b, colors.gray, colors.black);
        buffer.writeLine(b, x, y, 'ASCII', 'lightblue');
        canvas.innerHTML = buffer.toHtml(b);
    }, 1000);

};
