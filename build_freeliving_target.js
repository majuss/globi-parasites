'use strict';

const db = require('arangojs')();

db.query(`FOR doc in interaction_tsv
          FILTER doc.freeliving == 1 && doc.directionF == 'target'
          return doc`, {}, { ttl: 1000 * 3600 }).then(testAvailable); //filter for interaction; ie isparasyte

function testAvailable(cursor) {
    if (!cursor.hasNext()) { console.log('Finished building freeliving(target)'); return };

    cursor.next().then(doc => {
        try {
            const ottId = doc.targetTaxonIds.match(/OTT\:(\d+)/)[1];
            writeNewRankPath(ottId, doc);
        } catch (e) { } //here goes code to handle entries without OTTID
        testAvailable(cursor);
    });
}

function writeNewRankPath(ott, dok) {
    db.query(`for doc in (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl/304358' TO 'nodes_otl/${ott}' edges_otl return e)
    filter doc
    insert merge(doc, {_id:concat('edges_otl_sub/', doc._key),
                    _from:concat('nodes_otl_sub/', SPLIT(doc._from, '/')[1] ),
                    _to:concat('nodes_otl_sub/',   SPLIT(doc._to,   '/')[1] )
            }) in edges_otl_sub OPTIONS { ignoreErrors: true }`);
    db.query(`for doc in (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl/304358' TO 'nodes_otl/${ott}' edges_otl return v)
    filter doc

    UPSERT { _key: '${ott}'}
    INSERT merge(doc, {_id:concat('nodes_otl_sub/', doc._key),
                        freeliving: doc._key == '${ott}' ? 1 : 0,
                        globi: doc._key == '${ott}' ? 1 : 0,
                        interactionTypeNameFL: doc._key == '${ott}' ? '${dok.interactionTypeName}' : 'null',
                        directionFL: 'target'  }) 
    UPDATE { freeliving: doc._key == '${ott}' ? 1 : 0,
             globi: doc._key == '${ott}' ? 1 : 0,
             interactionTypeNameFL: doc._key == '${ott}' ? '${dok.interactionTypeName}' : 'null',
             directionFL: 'target' } in nodes_otl_sub OPTIONS { ignoreErrors: true }`); //if doc.key == searched OTTID update state to parasite
}
return;