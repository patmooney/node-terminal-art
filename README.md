# Node Terminal Art #

Converts popular image formats into a terminal-compatible low-resolution replica, the output of which can be printed directly to the terminal. I have previously used it to print out an embedded company logo within proprietary software on startup.

**Will default image output width to approximately three quarters the width of the terminal by default.**

*Image goes in - Ansii art comes out ( linux shell art! )*

![Example image](docs/example.png)

### Usage ###
Straight to print

    const terminalArt = require('terminal-art');
    await terminalArt.print(
        'my-image.png',
        {
            output: 'log', // console.log
            maxCharWidth: 20 // my terminal is only 20 characters wide
        }
    );

For use later (store as a file which can be cat'd or similar)

    const ansii = await terminalArt.toAnsii(
        myImageBuffer,
        {
            maxCharWidth: 100,
            mimeType: 'image/png'
        }
    );

### API ###

#### `print(filePath, { maxCharWidth: 40, output: 'log' }) -> Promise`
Convenience method which outputs ansii directly to console.log
##### Arguments
 - **filePath | imageBuffer** - for your desired image
 - **options**
    - **output** [default='log'] - console method to print to
    - **maxCharWidth** [default=(process.stdout.columns * 0.75)] - Appropximate width of terminal in characters (dictates image size/resolution)
    - **mimeType** - Required for image buffers

#### `toAnsii(filePath, { maxCharWidth: 40 }) -> Promise.<string>`
Extracts colour information from given image and returns a lower-resolution ansii representation in string format
##### Arguments
 - **filePath | imageBuffer** - for your desired image
 - **options**
    - **maxCharWidth** [default=(process.stdout.columns * 0.75)] - Appropximate width of terminal in characters (dictates image size/resolution)
    - **mimeType** - Required for image buffers
