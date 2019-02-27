# Node Console Art #
 
Converts popular image formats into a console-compatible low-resolution replica, the output of which can be printed directly to the         console.
 
*Image goes in - Ansii art comes out ( linux shell art! )*

![Example image](docs/example.png)
 
### Usage ###
Straight to print

    const consoleArt = require('console-art');
    consoleArt.print(
        'my-image.png',
        {
            output: 'log', // console.log
            maxCharWidth: 20 // my console is only 20 characters wide
        }
    );



For use later (store as a file which can be cat'd or similar)

    const ansii = consoleArt.toAnsii(
        'my-image',
        {
            maxCharWidth: 100
        }
    );
