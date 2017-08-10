'use strict';
const db = require('arangojs')();
const fastango3 = require('fastango3');
//const db = fastango3('http://127.0.0.1:8529');

async function counting(){

let phylla = await db.query(`
FOR doc IN OUTBOUND nodes_otl/691846 edges_otl
FILTER doc.rank == "phylum"
RETURN doc
`)

for(node in phylla){
    let result = await db.query(` FOR v IN INBOUND SHORTEST_PATH '${node._id}' TO 'nodes_otl/304358' edges_otl
                FILTER v.rank == "phyllum"
                RETURN v
                `)
    console.log(await result, node.name);
}

}

counting();