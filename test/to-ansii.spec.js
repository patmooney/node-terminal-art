const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('UNIT - toAnsi', function () {
    const terminalArt = require('../index');

    const sampleAnsii = '\u001b[0m\u001b[48;5;9m\u001b[38;5;9m \u001b[0m' +
            '\u001b[48;5;10m\u001b[38;5;10m \u001b[0m\n';
    const sampleBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAACXBIWXM' +
        'AAAsTAAALEwEAmpwYAAAAB3RJTUUH4wIbCwoYRArfTwAAABl0RVh0Q29tbWVudABDcmVhdGV' +
        'kIHdpdGggR0lNUFeBDhcAAAAWSURBVAjXY/jPwMDwn4GRgeH///8MAB72BP1IxgkfAAAAAElFTkSuQmCC', 'base64');
    const samplePath = './test/sample.png';
    const longPath = './test/long.png';

    it('Should faithfully convert a simple image to ansii', function () {
        return expect(terminalArt.toAnsii(samplePath))
            .to.eventually.equal(sampleAnsii);
    });

    it('Should appropriately limit the size of an image', async function () {
        const columns = 100;
        const ansii = await terminalArt.toAnsii(longPath, { maxCharWidth: columns });
        const filling = ansii.split('\n')[0].match(/\s/g);
        expect(filling.length).to.equal(columns);
    });

    it('Should accept a buffer', async function () {
        await expect(terminalArt.toAnsii(Buffer.from('irrelevant')))
            .to.eventually.be.rejectedWith(/buffer.+mimeType/);
        return expect(terminalArt.toAnsii(sampleBuffer, { mimeType: 'image/png' }))
            .to.eventually.equal(sampleAnsii);
    });
});
