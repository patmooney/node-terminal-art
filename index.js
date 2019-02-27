const toAnsii = require('./lib/image-to-ansii');

/**
 * Console Art
 *
 * Converts popular image formats into a terminal-compatible
 * low-resolution replica, the output of which can be printed
 * directly to the terminal.
 *
 * @example
 *
 *  // straight to print
 *  const terminalArt = require('terminal-art');
 *  terminalArt.print(
 *      'my-image.png',
 *      {
 *          output: 'log', // console.log
 *          maxCharWidth: 20 // my terminal is only 20 characters wide
 *      }
 *  );
 *
 *  // for use later (store as a file which can be cat'd or similar)
 *  const ansii = terminalArt.toAnsii(
 *      'my-image',
 *      {
 *          maxCharWidth: 100
 *      }
 *  );
 */
module.exports = {
    async print(path, options = {}) {
        console[options.output || 'log'](
            "\n" + await toAnsii(path, options.maxCharWidth)
        );
    },
    toAnsii(path, options = {}) {
        return toAnsii(path, options.maxCharWidth);
    }
};
