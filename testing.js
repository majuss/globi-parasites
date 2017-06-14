'use strict';

const db = require('arangojs')();

db.query(`for doc in weinstein_noott
          return doc`, {}, { ttl: 1000 * 3600 }).then(testAvailable); //filter for interaction; ie isparasyte

function testAvailable(cursor) {
    if (!cursor.hasNext()) { console.log('Finished / reached last entry'); return };

    cursor.next().then(doc => {
        try {

            const ottId = doc.ParentOTT;
            writeNewRankPath(ottId, doc);

        } catch (e) { } //here goes code to handle entries without OTTID
        testAvailable(cursor);
    });
}

function writeNewRankPath(ott, dok) {
    console.log('writing: ' + dok.sourceTaxonId + "      " + ott);
    
}
return;