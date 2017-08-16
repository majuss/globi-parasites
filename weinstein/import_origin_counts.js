'use-strict';
const fs = require("fs");
const db = require('arangojs')();
let str = fs.readFileSync("weinstein/weinstein_origins.tsv").toString('utf-8')//.split(",").map(Number);

let x = str.split('\n');
for (let i=0; i<x.length; i++) {
    y = x[i].split('\t');
    x[i] = y;
}

x.forEach(async entry => {
    try {
    await db.query(`UPDATE (FOR doc IN nodes_otl FILTER doc.name == "${entry[0]}" RETURN doc._key)[0] WITH {'nr_originw_from':${entry[1]}} IN nodes_otl`)
    }catch (err) {
        console.log(entry[0] + " " + entry[1]);
        return true;}
})