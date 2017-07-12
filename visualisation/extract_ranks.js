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
            Object.keys(phylla._result).forEach(async function (key) {
            let classs = await db.query(`
            FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${phylla._result[key]._key}' otl_parasites_edges
            FILTER v.rank == 'classs'
            INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
            INSERT {
            _from: "rank_extract/${phylla._result[key]._key}",
            _to: concat('rank_extract/', v._key)
            } INTO rank_extracte OPTIONS { ignoreErrors: true }
            return v
            `);
                Object.keys(classs._result).forEach(async function (key) {
                let order = await db.query(`
                FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${classs._result[key]._key}' otl_parasites_edges
                FILTER v.rank == 'order'
                INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
                INSERT {
                _from: "rank_extract/${classs._result[key]._key}",
                _to: concat('rank_extract/', v._key)
                } INTO rank_extracte OPTIONS { ignoreErrors: true }
                return v
                `);
                    Object.keys(order._result).forEach(async function (key) {
                    let family = await db.query(`
                    FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${order._result[key]._key}' otl_parasites_edges
                    FILTER v.rank == 'family'
                    INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
                    INSERT {
                    _from: "rank_extract/${order._result[key]._key}",
                    _to: concat('rank_extract/', v._key)
                    } INTO rank_extracte OPTIONS { ignoreErrors: true }
                    return v
                    `);
                        Object.keys(family._result).forEach(async function (key) {
                        let genus = await db.query(`
                        FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${family._result[key]._key}' otl_parasites_edges
                        FILTER v.rank == 'genus'
                        INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
                        INSERT {
                        _from: "rank_extract/${family._result[key]._key}",
                        _to: concat('rank_extract/', v._key)
                        } INTO rank_extracte OPTIONS { ignoreErrors: true }
                        return v
                        `);
                            Object.keys(genus._result).forEach(async function (key) {
                            let species = await db.query(`
                            FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${genus._result[key]._key}' otl_parasites_edges
                            FILTER v.rank == 'species'
                            INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
                            INSERT {
                            _from: "rank_extract/${genus._result[key]._key}",
                            _to: concat('rank_extract/', v._key)
                            } INTO rank_extracte OPTIONS { ignoreErrors: true }
                            return v
                            `);

                            })
                        })
                    })
                })
            })
        //console.log(kingdomcount._result[key].name, kingdomcount._result[key]._key, countp._result, countf._result); // kingdoms 
    })
}
counting();