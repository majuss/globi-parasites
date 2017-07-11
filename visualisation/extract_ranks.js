'use strict';

var db = require('arangojs')();

db.query(`
INSERT {
        _key: '304358',
        name: "Eukaryota",
        rank: "domain"
    } INTO rank_extract`);

// kingdom - phlyum - class - order - family - genus

async function counting() {
    
    let kingdomcount = await db.query(`
    FOR v,e IN 1..100 OUTBOUND 'otl_parasites_nodes/304358' otl_parasites_edges
    filter v.rank == 'kingdom'
    INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
    INSERT {
    _from: "rank_extract/304358",
    _to: concat('rank_extract/', v._key)
    } INTO rank_extracte OPTIONS { ignoreErrors: true }
    return v
    `);

   Object.keys(kingdomcount._result).forEach(async function (key) {
        let phylla = await db.query(`
        FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${kingdomcount._result[key]._key}' otl_parasites_edges
        FILTER v.rank == 'phylum'
        INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
        INSERT {
        _from: "rank_extract/${kingdomcount._result[key]._key}",
        _to: concat('rank_extract/', v._key)
        } INTO rank_extracte OPTIONS { ignoreErrors: true }
        return v
        `);
        //console.log(kingdomcount._result[key].name, kingdomcount._result[key]._key, countp._result, countf._result); // kingdoms 
    })
}
counting();