'use strict';

const db = require('arangojs')();
const collectione = db.edgeCollection('edges_otl_sub')
const collectionebak = db.edgeCollection('edges_otl_sub_bak')
const collection = db.collection('nodes_otl_sub')
const collectionbak = db.collection('nodes_otl_bak_sub')
collectione.drop();
collectionebak.drop();
collection.drop();
collectionbak.drop();
collectione.create()
collectionebak.create()
collection.create()
collectionbak.create()

db.query(`for doc in interaction_tsv
          filter doc.freeliving == 1 && doc.directionF == 'source'
          return doc`, {}, { ttl: 1000 * 3600 }).then(testAvailable); //filter for interaction; ie isparasyte

async function testAvailable(cursor) {
    await collectione.drop();
    await collectionebak.drop();
    await collection.drop();
    await collectionbak.drop();
    await collectione.create()
    await collectionebak.create()
    await collection.create()
    await collectionbak.create()

    if (!cursor.hasNext()) { console.log('Finished building freeliving(source)'); return };

    cursor.next().then(doc => {
        try {
            const ottId = doc.sourceTaxonIds.match(/OTT\:(\d+)/)[1];
            writeNewRankPath(ottId, doc);
        } catch (e) { } //here goes code to handle entries without OTTID
        testAvailable(cursor);
    });
}

function writeNewRankPath(ott, dok) {
    db.query(`for doc in (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl/304358' TO 'nodes_otl/${ott}' edges_otl return e)
    FILTER doc
    INSERT MERGE(doc, {_id:concat('edges_otl_sub/', doc._key),
                    _from:concat('nodes_otl_sub/', SPLIT(doc._from, '/')[1] ),
                    _to:concat('nodes_otl_sub/',   SPLIT(doc._to,   '/')[1] )
            }) in edges_otl_sub OPTIONS { ignoreErrors: true }`);
    db.query(`for doc in (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl/304358' TO 'nodes_otl/${ott}' edges_otl return v)
    FILTER doc
    
    UPSERT { _key: '${ott}'}
    INSERT MERGE(doc, {_id:concat('nodes_otl_sub/', doc._key),
                        freeliving: doc._key == '${ott}' ? 1 : 0,
                        globi: doc._key == '${ott}' ? 1 : 0,
                        interactionTypeNameFL: doc._key == '${ott}' ? '${dok.interactionTypeName}' : 'null',
                        directionFL: 'source'  }) 
    UPDATE { freeliving: doc._key == '${ott}' ? 1 : 0,
                        globi: doc._key == '${ott}' ? 1 : 0,
                        interactionTypeNameFL: doc._key == '${ott}' ? '${dok.interactionTypeName}' : 'null',
                        directionFL: 'source' } in nodes_otl_sub OPTIONS { ignoreErrors: true }`); //if doc.key == searched OTTID update state to parasite
}
return;