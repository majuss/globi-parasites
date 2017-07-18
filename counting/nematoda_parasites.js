'use strict';

var db = require('arangojs')();
db.query(`INSERT { _key: "nematoda_chromadorea_f" } IN counts`);
db.query(`INSERT { _key: "nematoda_chromadorea_p" } IN counts`);
db.query(`INSERT { _key: "nematoda_enoplea_f" } IN counts`);
db.query(`INSERT { _key: "nematoda_enoplea_p" } IN counts`);


//chromadorea freeliving


db.query(`FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/931693' edges_otl_sub
          filter v.rank == 'order'
          RETURN v`, {}, { ttl: 1000 * 3600 }).then(getchromadorea_f);

function getchromadorea_f(cursor) {
    if (!cursor.hasNext()) { console.log('Finished chromadorea_f'); return };
    cursor.next().then(doc => {
        try {
            insertchromadorea_f(doc);
        } catch (e) { }
        getchromadorea_f(cursor);
    });
}

async function insertchromadorea_f(currentDoc) {
    let phylumCount = await db.query(`
    return count(
    FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/${currentDoc._key}' edges_otl_sub
          filter v.freeliving == 1
    RETURN v)`)
    db.query(`UPDATE "nematoda_chromadorea_f" WITH { ${currentDoc.name}: ${phylumCount._result} } IN counts`)
};

//chromadorea parasites

db.query(`FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/931693' edges_otl_sub
          filter v.rank == 'order'
          RETURN v`, {}, { ttl: 1000 * 3600 }).then(getchromadorea_p);

function getchromadorea_p(cursor) {
    if (!cursor.hasNext()) { console.log('Finished chromadorea_p'); return };
    cursor.next().then(doc => {
        try {
            insertchromadorea_p(doc);
        } catch (e) { }
        getchromadorea_p(cursor);
    });
}

async function insertchromadorea_p(currentDoc) {
    let phylumCount = await db.query(`
    return count(
    FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/${currentDoc._key}' edges_otl_sub
          filter v.parasite == 1
    RETURN v)`)
    db.query(`UPDATE "nematoda_chromadorea_p" WITH { ${currentDoc.name}: ${phylumCount._result} } IN counts`)
};

//enoplea freeliving

db.query(`FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/931695' edges_otl_sub
          filter v.rank == 'order'
          RETURN v`, {}, { ttl: 1000 * 3600 }).then(getenoplea_f);

function getenoplea_f(cursor) {
    if (!cursor.hasNext()) { console.log('Finished enoplea_f'); return };
    cursor.next().then(doc => {
        try {
            insertenoplea_f(doc);
        } catch (e) { }
        getenoplea_f(cursor);
    });
}

async function insertenoplea_f(currentDoc) {
    let phylumCount = await db.query(`
    return count(
    FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/${currentDoc._key}' edges_otl_sub
          filter v.freeliving == 1
    RETURN v)`)
    db.query(`UPDATE "nematoda_enoplea_f" WITH { ${currentDoc.name}: ${phylumCount._result} } IN counts`)
};

//enoplea parasites

db.query(`FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/931695' edges_otl_sub
          filter v.rank == 'order'
          RETURN v`, {}, { ttl: 1000 * 3600 }).then(getenoplea_p);

function getenoplea_p(cursor) {
    if (!cursor.hasNext()) { console.log('Finished enoplea_p'); return };
    cursor.next().then(doc => {
        try {
            insertenoplea_p(doc);
        } catch (e) { }
        getenoplea_p(cursor);
    });
}

async function insertenoplea_p(currentDoc) {
    let phylumCount = await db.query(`
    return count(
    FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/${currentDoc._key}' edges_otl_sub
          filter v.parasite == 1
    RETURN v)`)
    db.query(`UPDATE "nematoda_enoplea_p" WITH { ${currentDoc.name}: ${phylumCount._result} } IN counts`)
};































// retrieve orders
/*

`FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/931693' edges_otl_sub
          filter v.rank == 'order'
          RETURN v`



`FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/931695' edges_otl_sub
          filter v.rank == 'order'
          RETURN v`
*/