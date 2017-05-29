'use strict';

const db = require('arangojs')();
const collection = db.collection('otl_parasites_nodes');

db.query(`for doc in interaction_tsv sort rand() limit 100 return doc`, {}, { ttl: 1000 * 3600 }).then(testAvailable); //filter for interaction; ie isparasyte
var counter = 0;

function testAvailable(cursor) {
    if (!cursor.hasNext()) { console.log('Finished / reached last entry'); return };

    cursor.next().then(doc => {
        try {
            const ottId = doc.sourceTaxonIds.match(/OTT\:(\d+)/)[1];
            writeNewRankPath(ottId);
        } catch(e) {}
        testAvailable(cursor); // recursive function; calls itself
    });
}

function writeNewRankPath(ott) {
    console.log('write rank');
    db.query(`for doc in (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl/304358' TO 'nodes_otl/${ott}' GRAPH 'otl' return e)
    filter doc
    insert merge(doc, {_id:concat('otl_parasites_edges/', doc._key),
                    _from:concat('otl_parasites_nodes/', SPLIT(doc._from, '/')[1] ),
                    _to:concat('otl_parasites_nodes/',   SPLIT(doc._to,   '/')[1] )
            }) in otl_parasites_edges OPTIONS { ignoreErrors: true }`);

    db.query(`for doc in (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl/304358' TO 'nodes_otl/${ott}' GRAPH 'otl' return v)
    filter doc
    insert merge(doc, {_id:concat('otl_parasites_nodes/', doc._key), parasite: doc.rank == 'species' ? 1 : 0 }) in otl_parasites_nodes OPTIONS { ignoreErrors: true }`);
}


return;





















function getFailedID(cursor) {
    if (!cursor.hasNext()) { console.log('Finished getFailedID'); return };
    cursor.next().then(failedID => {
        db.query(`FOR node, edge IN OUTBOUND SHORTEST_PATH "names/1" TO '${failedID}' GRAPH "ncbi" RETURN [node.name, edge.rank]`, {}, { ttl: 1 * 3600 }).then(getRankPath);
    });
}

function getRankPath(cursor) {
    if (!cursor.hasNext()) { console.log('Finished getRankPath'); return };
    cursor.next().then(rankPath => {
        console.log(typeof (RankPath), rankPath, Object.keys(rankPath));
    });
}




return;