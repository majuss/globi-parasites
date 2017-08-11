'use strict';
const db = require('arangojs')();

async function counting(){

let phylla = await db.query(`
FOR doc IN OUTBOUND 'nodes_otl/691846' edges_otl
FILTER doc.rank == "phylum"
RETURN doc
`)
phylla = await phylla.all();

    for(const node of phylla){
    let result = await db.query(`
    FOR v IN INBOUND SHORTEST_PATH '${node._id}' TO 'nodes_otl/304358' edges_otl
    FILTER v.rank == "phyllum"
    RETURN v
    `)
    result = await result.all();
    console.log(result)
    console.log(result, node.name);
    }

}

counting();