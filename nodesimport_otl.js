'use strict';

const fastango = require('fastango3')('http://127.0.0.1:8529');
const fs       = require('fs');
const instream = fs.createReadStream('data/taxonomy.tsv');
const db       = require('arangojs')();

const collection = db.collection('nodes_otl');
const collectionbak = db.collection('nodes_otl_bak');

const bufs = [];

instream.on('data', async function(d) {
    instream.pause();
    bufs.push(d);
    await readNames();
    instream.resume();
});
instream.on('end', () => {
    readLast();
    console.log('Finished building OTT nodes');
});

async function readNames() {
    await collection.drop();
    await collectionbak.drop();
    await collection.create()
    await collectionbak.create()

    const b = Buffer.concat(bufs);

    let start = 0;
    let idx;

    while(true) {
        idx = b.indexOf('\n', start);
        if (-1 === idx) {
            bufs.length = 0;
            bufs.push(b.slice(start));
            break;
        }
        await parseLine(b.slice(start, idx).toString());
        start = idx + 1;
    }
};

async function readLast() {
    const b = Buffer.concat(bufs);
    if (0 === b.length) return;
    await parseLine(b.toString());
};

async function parseLine(line) {
    line = line.split('\t|\t');
    await fastango.nodes_otl.asyncSave(JSON.stringify({ _key:line[0], name:line[2], rank:line[3] }));
    //console.log(status);

};
