# Node Terminal Art #

Converts popular image formats into a terminal-compatible low-resolution replica, the output of which can be printed directly to the terminal. I have previously used it to print out an embedded company logo within proprietary software on startup.

**Will default image output width to approximately three quarters the width of the terminal by default.**

*Image goes in - Ansii art comes out ( linux shell art! )*

![Example image](docs/example.png)

### Usage ###
**Simple**
```
    const { toAnsii } = require('terminal-art');

    // Default uses 75% of the current terminal width.
    toAnsii('/path/to/img').then(console.log);
```
**From Buffer + size stipulation**
```

    const ansii = await terminalArt.toAnsii(
        myImageBuffer,
        {
            maxCharWidth: 100,
            mimeType: 'image/png'
        }
    );
    console.log(ansii);
```
**Pre-compile, save for later**
```
    // Render once, save for later, print any time.
    toAnsii('/path/to/img').then(text => toFile('./save-for-later.txt', text));

    // Two hours later
    const compiledAnsiiImage = await fromFile('./save-for-later.txt');
    console.log(compiledAnsiiImage);
```
### API ###

#### `toAnsii(filePath, { maxCharWidth?: 40, mimeType?: 'image/png' }): Promise<string>`
Extracts colour information from given image and returns a lower-resolution ansii representation in string format
##### Arguments
 - `filePath | imageBuffer` - for your desired image
 - `options`
    - `maxCharWidth` [default=(process.stdout.columns * 0.75)] - Appropximate width of terminal in characters (dictates image size/resolution)
    - `mimeType` - Required for image buffers
