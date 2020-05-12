const s = require('../index');
const runs = 20;
const input = process.argv[2];
if (!input) {
    console.error('Input image path required');
    process.exit(1);
}

runTest(() => s.toAnsii(process.argv[2])).then(console.log);

async function runTest(test) {
    const results = [];
    for (let tI = 0; tI < 20; tI++){
        const start = Date.now();
        await test();
        results.push(Date.now() - start);
    }

    return {
        results: results.slice(),
        avg: results.reduce((tot, r) => tot + r, 0) / results.length,
        max: results.sort().reverse()[0],
        min: results.sort()[0],
        tot: results.reduce((tot, r) => tot + r, 0)
    };
}
