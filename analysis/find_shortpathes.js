'use strict';

const db = require('arangojs')();
const fs = require('fs');

async function pathcalc() {
    let alllengths = {};

    let leafs = await db.query(`
        FOR node IN nodes_otl_sub
        //limit 20000
        FILTER 0 == length(
        FOR v,e,p IN OUTBOUND node._id edges_otl_sub
        RETURN v)
        RETURN node._id
        `);
    
    leafs = await leafs.all();

    //const keys = Object.keys(leafs)
    

    for(const key of leafs) {

    // await keys.forEach(async function (key) {
        let pathlength = await db.query(`
        RETURN COUNT(
        FOR v,e IN INBOUND SHORTEST_PATH '${key}' TO 'nodes_otl_sub/304358' edges_otl_sub RETURN e
        )`);
        pathlength = await pathlength.all();

        pathlength = pathlength[0];

        if (alllengths[pathlength] === undefined) {
            alllengths[pathlength] = 0;
        }
        alllengths[pathlength]++;
    };
    return alllengths;
}

async function x() {

    const res = await pathcalc();
    console.log(res);
    fs.writeFileSync("pathes.txt", res);
}
x();





return;

async function calc(leafs, alllengths) {

}

async function printarray(alllengths) {
    await pathcalc();
    console.log(alllengths);
    var file = fs.createWriteStream('array.txt');
    file.on('error', function (err) { /* error handling */ });
    alllengths.forEach(function (v) { file.write(v.join(', ') + '\n'); });
    file.end();
}

pathcalc();