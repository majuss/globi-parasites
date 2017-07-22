'use strict';

const db = require('arangojs')();

db.query(`for doc in weinstein_noott
          return doc`, {}, { ttl: 1000 * 3600 }).then(testAvailable); //filter for interaction; ie isparasyte

function testAvailable(cursor) {
    if (!cursor.hasNext()) { console.log('Finished writing weinstein noott weinonly'); return };

    cursor.next().then(doc => {
        try {
            const ottId = doc.ParentOTT;
            writeNewRankPath(ottId, doc);

        } catch (e) { } //here goes code to handle entries without OTTID
        db.query(`
        insert {_id: concat('edges_otl_weinonly/', ${doc.sourceTaxonId}),
            _key: ${doc.sourceTaxonId},
            _from: concat('nodes_otl_weinonly/', ${doc.ParentOTT}),
            _to: concat('nodes_otl_weinonly/', ${doc.sourceTaxonId})} in edges_otl_weinonly OPTIONS { ignoreErrors: true }`);

        db.query(`
        INSERT {_id:concat('nodes_otl_weinonly/', ${doc.sourceTaxonId}),
            _key: ${doc.sourceTaxonId},
            name: '${doc.sourceTaxonName}',
            rank: 'species',
            parasite: 1,
            weinstein: 1}in nodes_otl_weinonly OPTIONS { ignoreErrors: true }`);

        testAvailable(cursor);
    });
}

function writeNewRankPath(ott, dok) {

    db.query(`
    for doc in (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl_weinonly/304358' TO 'nodes_otl_weinonly/${ott}' edges_otl_weinonly return e)
    filter doc
    insert merge(doc, {_id:concat('edges_otl_weinonly/', doc._key),
                       _from:concat('nodes_otl_weinonly/', SPLIT(doc._from, '/')[1] ),
                       _to:concat('nodes_otl_weinonly/',   SPLIT(doc._to,   '/')[1] )}) in edges_otl_weinonly OPTIONS { ignoreErrors: true }`);



    db.query(`
    for doc in (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl_weinonly/304358' TO 'nodes_otl_weinonly/${ott}' edges_otl_weinonly return v)
    filter doc
    INSERT merge(doc, { _id:concat('nodes_otl_weinonly/', doc._key), parasite: 0, weinstein: 1 }) in nodes_otl_weinonly OPTIONS { ignoreErrors: true }`);


}
return;