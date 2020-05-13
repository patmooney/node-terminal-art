const promisify = require('util').promisify;
const getPixels = promisify(require('get-pixels'));

const nL = "\n"; // eslint-disable-line quotes
// Applies control sequences when printing to screen
const cS = (...c) => '\x1B' + `[${c.join('')}m`;
const colourOctal = ansii => cS(0) + cS('48;5;', ansii) + cS('38;5;', ansii);

/**
 * Converts popular image formats into a long octal sequence representative
 * of the colours within. Effectively returning a terminal-compatible
 * low-resolution copy of the inputted image.
 * - Approximates the terminal width and sets the image to a 3/4 ratio in
 *   the event of a width not being stipulated.
 * - Either a file `path` or `Buffer` may be provided, a mimeType is mandatory
 *   for the latter
 *
 * @param {Buffer|string} path
 * @param {Object} [options]
 * @param {number} [options.maxCharWidth] - how many characters wide should the image be
 * @param {string} [options.mimeType] - in the event that a buffer is provided as source
 * @param {number} [options.minDist=5] - a higher number may improve speed but reduce colour accuracy
 * @returns {Promise.<string>} ansii
 */
module.exports = async function imageToAnsii(path, { maxCharWidth = null, mimeType = null, minDist = 5 } = {}) {
    // limit image width
    const pixels2d = await readImage(
        path,
        mimeType,
        maxCharWidth || process.stdout.columns * 0.75
    );

    let output = '';
    let previousAnsii, previousColour;
    function getAnsiiCode(colours, colourStr) {
        if (colours[3] === 0) {
            return [
                null,
                colourStr === previousColour
                    ? ' '
                    : cS(0) + ' '
            ];
        }
        const ansii = colourStr === previousColour
            ? previousAnsii
            : pixelToAnsii(applyAlpha(colours), minDist);
        return [
            ansii,
            ansii === previousAnsii
                ? ' '
                : colourOctal(ansii) + ' '
        ];
    }

    for (let y = 0; y < pixels2d.length; y += 1) {
        for (let x = 0; x < pixels2d[y].length; x += 1) {
            const colours = pixels2d[y][x];
            const colourStr = colours.join('.');

            const [ansii, ansiiCode] = getAnsiiCode(colours, colourStr);

            output += ansiiCode;
            previousColour = colourStr;
            previousAnsii = ansii || previousAnsii;
        }
        output += cS(0) + nL;
        previousAnsii = null;
        previousColour = null;
    }

    return output;
};

/**
 * Returns an octal sequence which represents the ansii
 * colour best matching the given rgb value
 * @param {number[]} - r, g, b
 * @returns {string}
 */
function pixelToAnsii(colours, minDist = 5) {
    let closest = null;
    let chosen = null;

    for (const ansii in _source) {
        const dist = getDist(colours, _source[ansii]);
        if (dist <= minDist) {
            return ansii;
        }
        if (closest === null || dist < closest) {
            closest = dist;
            chosen = ansii;
        }
    }

    return chosen;
}

function applyAlpha(colours) {
    const alpha = colours.length > 3
        ? colours[3]
        : 255;
    if (alpha > 240) {
        return colours;
    }
    const normalisedAlpha = alpha / 255 || 0;
    const addAlpha = c => c * normalisedAlpha;

    return [addAlpha(colours[0]), addAlpha(colours[1]), addAlpha(colours[2]), alpha];
}

/**
 * The euclidean distance between two 3d arrays
 * @param {number[]} - r, g, b
 * @param {number[]} - r, g, b
 * @returns {number}
 */
function getDist(s1, s2) {
    return Math.sqrt(
        Math.pow(s1[0] - s2[0], 2) +
        Math.pow(s1[1] - s2[1], 2) +
        Math.pow(s1[2] - s2[2], 2)
    );
}

/**
* converts image to 2d array of pixel colours
* @param {string} path
* @returns {number[][]}
*/
async function readImage(path, mimeType, maxCharWidth) {
    if (path instanceof Buffer && !mimeType) {
        throw new Error('If a buffer is provided, so should be the mimeType as part of the options');
    }

    const pixels = await getPixels(path, mimeType);
    const [width, height, channels] = pixels.shape;

    // Because we are printing to a medium which has long pixels along the Y axis,
    // a sampling offset always has to be made
    let xOffset = 1;
    let yOffset = 1;
    if (width > maxCharWidth) {
        xOffset = Math.ceil(width / maxCharWidth);
    }
    yOffset = parseInt(
        (((xOffset / width) * height) * 2) * (width / height)
    );

    const pixelArray = [];
    for (let y = 0; y < height; y += yOffset) {
        const rowArray = [];
        for (let x = 0; x < width; x += xOffset) {
            const offset = (y * width * channels) + (x * channels);
            rowArray.push(pixels.data.slice(offset, offset + channels));
        }
        pixelArray.push(rowArray);
    }
    return pixelArray;
};

const loadSource = source => source.split(';').reduce(
    (acc, hex) => {
        const dec = parseInt(hex, 16);
        const [ansii, ...colours] = [24, 16, 8, 0]
            .map(pow => (dec >> pow) & 255).reverse();
        return { ...acc, [ansii]: colours };
    },
    {}
);

/**
 * Serialisation of octal codes for ansii colours
 */
const _source = loadSource('0;8001;800002;808003;80000004;80008005;80800006;c0c0c007;80808008;ff09;ff000a;ffff0b;ff00000c;ff00ff0d;ffff000e;ffffff0f;10;5f000011;87000012;af000013;d7000014;ff000015;5f0016;5f5f0017;875f0018;af5f0019;d75f001a;ff5f001b;87001c;5f87001d;8787001e;af87001f;d7870020;ff870021;af0022;5faf0023;87af0024;afaf0025;d7af0026;ffaf0027;d70028;5fd70029;87d7002a;afd7002b;d7d7002c;ffd7002d;ff002e;5fff002f;87ff0030;afff0031;d7ff0032;ffff0033;5f34;5f005f35;87005f36;af005f37;d7005f38;ff005f39;5f5f3a;5f5f5f3b;875f5f3c;af5f5f3d;d75f5f3e;ff5f5f3f;875f40;5f875f41;87875f42;af875f43;d7875f44;ff875f45;af5f46;5faf5f47;87af5f48;afaf5f49;d7af5f4a;ffaf5f4b;d75f4c;5fd75f4d;87d75f4e;afd75f4f;d7d75f50;ffd75f51;ff5f52;5fff5f53;87ff5f54;afff5f55;d7ff5f56;ffff5f57;8758;5f008759;8700875a;af00875b;d700875c;ff00875d;5f875e;5f5f875f;875f8760;af5f8761;d75f8762;ff5f8763;878764;5f878765;87878766;af878767;d7878768;ff878769;af876a;5faf876b;87af876c;afaf876d;d7af876e;ffaf876f;d78770;5fd78771;87d78772;afd78773;d7d78774;ffd78775;ff8776;5fff8777;87ff8778;afff8779;d7ff877a;ffff877b;af7c;5f00af7d;8700af7e;af00af7f;d700af80;ff00af81;5faf82;5f5faf83;875faf84;af5faf85;d75faf86;ff5faf87;87af88;5f87af89;8787af8a;af87af8b;d787af8c;ff87af8d;afaf8e;5fafaf8f;87afaf90;afafaf91;d7afaf92;ffafaf93;d7af94;5fd7af95;87d7af96;afd7af97;d7d7af98;ffd7af99;ffaf9a;5fffaf9b;87ffaf9c;afffaf9d;d7ffaf9e;ffffaf9f;d7a0;5f00d7a1;8700d7a2;af00d7a3;d700d7a4;ff00d7a5;5fd7a6;5f5fd7a7;875fd7a8;af5fd7a9;d75fd7aa;ff5fd7ab;87d7ac;5f87d7ad;8787d7ae;af87d7af;d787d7b0;ff87d7b1;afd7b2;5fafd7b3;87afd7b4;afafd7b5;d7afd7b6;ffafd7b7;d7d7b8;5fd7d7b9;87d7d7ba;afd7d7bb;d7d7d7bc;ffd7d7bd;ffd7be;5fffd7bf;87ffd7c0;afffd7c1;d7ffd7c2;ffffd7c3;ffc4;5f00ffc5;8700ffc6;af00ffc7;d700ffc8;ff00ffc9;5fffca;5f5fffcb;875fffcc;af5fffcd;d75fffce;ff5fffcf;87ffd0;5f87ffd1;8787ffd2;af87ffd3;d787ffd4;ff87ffd5;afffd6;5fafffd7;87afffd8;afafffd9;d7afffda;ffafffdb;d7ffdc;5fd7ffdd;87d7ffde;afd7ffdf;d7d7ffe0;ffd7ffe1;ffffe2;5fffffe3;87ffffe4;afffffe5;d7ffffe6;ffffffe7;80808e8;121212e9;1c1c1cea;262626eb;303030ec;3a3a3aed;444444ee;4e4e4eef;585858f0;626262f1;6c6c6cf2;767676f3;808080f4;8a8a8af5;949494f6;9e9e9ef7;a8a8a8f8;b2b2b2f9;bcbcbcfa;c6c6c6fb;d0d0d0fc;dadadafd;e4e4e4fe;eeeeeeff');
