'use strict';

const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.sendTo(console);
virtualConsole.on('jsdomError', (err) => console.log(err));

const dom = new JSDOM(fs.readFileSync('sunburst_example2.html', 'utf8'), {
    contentType: 'text/html',
    includeNodeLocations: true,
    runScripts: 'dangerously', virtualConsole,
    resources: 'usable'
});






/* setTimeout(() => {

    const node = dom.window.document.querySelector('svg');

    console.log(node);



}, 10 * 1000); */
