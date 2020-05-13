const s = require('../index');
const runs = 20;
const input = process.argv[2];
const minDist = parseInt(process.argv[3] || 5);

if (!input) {
    console.error('Input image path required');
    process.exit(1);
}

runTest(() => s.toAnsii(process.argv[2], { minDist })).then(console.log);
s.print(process.argv[2], { minDist });
async function runTest(test) {
    const results = [];
    for (let tI = 0; tI < runs; tI++) {
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
