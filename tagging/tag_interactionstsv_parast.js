'use strict';
const db = require('arangojs')();

//tag parasites source

db.query(`for doc in interaction_tsv
          filter doc.interactionTypeName == "hasParasite" ||
          doc.interactionTypeName == "hasPathogen" ||
          doc.interactionTypeName == "hasParasite"
          return doc`, {}, { ttl: 1000 * 3600 }).then(tagParasS); //filter for interaction; ie isparasyte

function tagParasS(cursor) {
    if (!cursor.hasNext()) { console.log('Finished tagging parasites(target)'); return };
    cursor.next().then(doc => {
        try {db.query(`UPDATE "${doc._key}" WITH { parasite: 1,
                                                   directionP: "target",
                                                   pname: '${doc.targetTaxonName}' } IN interaction_tsv`);
        } catch (e) { }
        tagParasS(cursor);
    });
}

