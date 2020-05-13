const imageToAnsii = require('./lib/image-to-ansii');

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
 *  await terminalArt.print(
 *      'my-image.png',
 *      {
 *          output: 'log', // console.log
 *          maxCharWidth: 20 // my terminal is only 20 characters wide
 *      }
 *  );
 *
 *  // for use later (store as a file which can be cat'd or similar)
 *  const ansii = await terminalArt.toAnsii(
 *      myImageBuffer,
 *      {
 *          maxCharWidth: 100,
 *          mimeType: 'image/png'
 *      }
 *  );
 */
module.exports = {
    async print(path, options = {}) {
        console[options.output || 'log'](
            "\n" + await imageToAnsii(path, options) // eslint-disable-line quotes
        );
    },
    toAnsii(path, options = {}) {
        return imageToAnsii(path, options);
    }
};
