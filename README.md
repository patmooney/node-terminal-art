# Node Terminal Art #
 
Converts popular image formats into a terminal-compatible low-resolution replica, the output of which can be printed directly to the terminal.
 
*Image goes in - Ansii art comes out ( linux shell art! )*

![Example image](docs/example.png)
 
### Usage ###
Straight to print

    const terminalArt = require('terminal-art');
    terminalArt.print(
        'my-image.png',
        {
            output: 'log', // console.log
            maxCharWidth: 20 // my terminal is only 20 characters wide
        }
    );



For use later (store as a file which can be cat'd or similar)

    const ansii = terminalArt.toAnsii(
        'my-image',
        {
            maxCharWidth: 100
        }
    );
