const expect = require('chai').expect;

describe('UNIT - toAnsi', function () {
    const terminalArt = require('../index');

    it('Should faithfully convert a simple image to ansii', async function () {
        const expected = '\u001b[0m\u001b[48;5;9m\u001b[38;5;9m \u001b[0m'
            + '\u001b[48;5;10m\u001b[38;5;10m \u001b[0m\n\u001b[0m'
            + '\u001b[48;5;12m\u001b[38;5;12m \u001b[0m\u001b[48;5;15m'
            + '\u001b[38;5;15m \u001b[0m\n';
        const ansii = await terminalArt.toAnsii('./test/sample.png');
        expect(ansii).to.equal(expected);
    });
});
