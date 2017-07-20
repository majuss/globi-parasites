'use strict';

const db = require('arangojs')();

db.query(`for doc in weinstein
          return doc`, {}, { ttl: 1000 * 3600 }).then(testAvailable); //filter for interaction; ie isparasyte

function testAvailable(cursor) {
    if (!cursor.hasNext()) { console.log('Finished writing weinstein'); return };

    cursor.next().then(doc => {
        try {
            const ottId = doc.sourceTaxonId;
            writeNewRankPath(ottId);

        } catch (e) { } //here goes code to handle entries without OTTID
        //insert noott stuff
        testAvailable(cursor);
    });
}

function writeNewRankPath(ott) {
    console.log('writing: ' + ott);
    db.query(`
    for doc in (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl_sub/304358' TO 'nodes_otl_sub/${ott}' edges_otl_sub return e)
    filter doc

    insert merge(doc, {_id:concat('edges_otl_sub/', doc._key),
                       _from:concat('nodes_otl_sub/', SPLIT(doc._from, '/')[1] ),
                       _to:concat('nodes_otl_sub/',   SPLIT(doc._to,   '/')[1] )}) in edges_otl_sub OPTIONS { ignoreErrors: true }`);

    db.query(`
    for doc in (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl_sub/304358' TO 'nodes_otl_sub/${ott}' edges_otl_sub return v)
    filter doc

    UPSERT { _key: '${ott}' }
    INSERT merge(doc, {_id:concat('nodes_otl_sub/', doc._key),
                        parasite: doc._key == '${ott}' ? 1 : 0,
                        weinstein: doc._key == '${ott}' ? 1 : 0}) 
    
    UPDATE { parasite: doc._key == '${ott}' ? 1 : 0,
             weinstein: doc._key == '${ott}' ? 1 : 0} in nodes_otl_sub OPTIONS { ignoreErrors: true }`);

}
return;

