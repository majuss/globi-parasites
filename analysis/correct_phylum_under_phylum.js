'use strict';
const db = require('arangojs')();
const fs = require('fs');
const jsonexport = require('jsonexport');
const ranks = ["domain", "kingdom", "phylum", "class", "order", "family"]

async function analyse(ranks) {

    for (let i = 0; i < ranks.length; i++) {

        let output = [];
        let phylla = await db.query(`
        FOR doc IN 1..100 OUTBOUND 'nodes_otl/304358' edges_otl
        FILTER doc.rank == "${ranks[i]}"
        RETURN doc
        `)
        phylla = await phylla.all();

        for (const node of phylla) {
            let result = await db.query(`
            FOR v IN INBOUND SHORTEST_PATH '${node._id}' TO 'nodes_otl/304358' edges_otl
            FILTER v.name != "${node.name}" && v.rank == "${ranks[i]}"
            RETURN v
            `)
            result = await result.all();
            
            if(result.length != 0){
                //console.log(result.length)
            let rankie = "super" + ranks[i]
            //console.log(rankie);
            db.query(`UPDATE '${result[0]._key}' WITH { rank: "${rankie}" } IN nodes_otl`)
            output.push(ranks[i]+ ' ' + result[0].name + ' is before: ' + node.name)
            }
        }
    }
    console.log("done correcting ranks");
}
analyse(ranks);