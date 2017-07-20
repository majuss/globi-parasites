'use strict';
const db = require('arangojs')();

//tag parasites source

db.query(`for doc in interaction_tsv
          filter doc.interactionTypeName == "parasiteOf" ||
          doc.interactionTypeName == "ectoParasiteOf" ||
          doc.interactionTypeName == "kleptoparasiteOf" ||
          doc.interactionTypeName == "ectoParasitoid" ||
          doc.interactionTypeName == "endoparasiteOf" ||
          doc.interactionTypeName == "parasitoidOf" ||
          doc.interactionTypeName == "endoparasitoidOf" ||
          doc.interactionTypeName == "pathogenOf"
          return doc`, {}, { ttl: 1000 * 3600 }).then(tagParasS); //filter for interaction; ie isparasyte

function tagParasS(cursor) {
    if (!cursor.hasNext()) { console.log('Finished tagging parasites(source)'); return };
    cursor.next().then(doc => {
        try {db.query(`UPDATE "${doc._key}" WITH { parasite: 1,
                                                   directionP: "source",
                                                   pname: '${doc.sourceTaxonName}' } IN interaction_tsv`);
        } catch (e) { }
        tagParasS(cursor);
    });
}

