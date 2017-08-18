'use strict';
const db = require('arangojs')();
const fs = require('fs');
const jsonexport = require('jsonexport');
const ranks = ["kingdom", "phylum", "class", "order", "family"]

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
            try { output.push(ranks[i]+ ' ' + result[0].name + ' is before: ' + node.name) } catch (err) { }
        }
        jsonexport(output, function (err, csv) {
            if (err) return console.log(err);
            fs.writeFileSync('analysis/generated_tables/' + ranks[i] + '_under_' + ranks[i] + '.csv', csv);
        });
    }
}
analyse(ranks);