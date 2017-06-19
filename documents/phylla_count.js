'use strict';
//retrieve counts for all METAZOA PARASITES

var db = require('arangojs')();
db.query(`REMOVE "phylla_metazoa" IN counts`);
db.query(`INSERT { _key: "phylla_metazoa" } IN counts`);


db.query(`FOR v,e IN 1..100 outbound 'otl_parasites_nodes/691846' otl_parasites_edges
          filter v.rank == 'phylum'
          RETURN v`, {}, { ttl: 1000 * 3600 }).then(getPhylum);

function getPhylum(cursor) {
    if (!cursor.hasNext()) { console.log('Finished / reached last entry'); return };

    cursor.next().then(doc => {
        try {
            insertPhylum(doc);
        } catch (e) { }
        getPhylum(cursor);
    });
}

async function insertPhylum(currentDoc) {
    let phylumCount = await db.query(`
    return count(
    FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${currentDoc._key}' otl_parasites_edges
          filter v.parasite == 1
    RETURN v)
    `)
    db.query(`UPDATE "phylla_metazoa" WITH { ${currentDoc.name}: ${phylumCount._result} } IN counts`)
};