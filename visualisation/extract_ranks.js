'use strict';

var db = require('arangojs')();

db.query(`
INSERT {
        _key: "691846",
        name: "Metazoa",
        rank: "Kingdom"
    } INTO rank_extract OPTIONS { ignoreErrors: true }`);

// phlyum - class - order - family - genus

async function counting() {


    let phylla = await db.query(`
        FOR v,e IN 1..100 outbound 'nodes_otl/691846' edges_otl
        FILTER v.rank == 'phylum'
        INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
        INSERT {
        _from: "rank_extract/691846",
        _to: concat('rank_extract/', v._key)
        } INTO rank_extracte OPTIONS { ignoreErrors: true }
        return v._key
        `);

    phylla = await phylla.all();

    for (const key of phylla) {
        let classs = await db.query(`
            FOR v,e IN 1..100 outbound 'nodes_otl/${key}' edges_otl
            FILTER v.rank == 'class'
            INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
            INSERT {
            _from: "rank_extract/${key}",
            _to: concat('rank_extract/', v._key)
            } INTO rank_extracte OPTIONS { ignoreErrors: true }
            return v._key
            `);


        classs = await classs.all();

        for (const key2 of classs) {
            let order = await db.query(`
            FOR v,e IN 1..100 outbound 'nodes_otl/${key2}' edges_otl
            FILTER v.rank == 'order'
            INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
            INSERT {
            _from: "rank_extract/${key2}",
            _to: concat('rank_extract/', v._key)
            } INTO rank_extracte OPTIONS { ignoreErrors: true }
            return v._key
            `);

            order = await order.all();

            for (const key3 of order) {
                let family = await db.query(`
            FOR v,e IN 1..100 outbound 'nodes_otl/${key3}' edges_otl
            FILTER v.rank == 'family'
            INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
            INSERT {
            _from: "rank_extract/${key3}",
            _to: concat('rank_extract/', v._key)
            } INTO rank_extracte OPTIONS { ignoreErrors: true }
            return v._key
            `);

                family = await family.all();


                for (const key4 of family) {
                    let genus = await db.query(`
            FOR v,e IN 1..100 outbound 'nodes_otl/${key4}' edges_otl
            FILTER v.rank == 'genus'
            INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
            INSERT {
            _from: "rank_extract/${key4}",
            _to: concat('rank_extract/', v._key)
            } INTO rank_extracte OPTIONS { ignoreErrors: true }
            return v._key
            `);

                    genus = await genus.all();

                    for (const key5 of genus) {
                        let species = await db.query(`
            FOR v,e IN 1..100 outbound 'nodes_otl/${key5}' edges_otl
            FILTER v.rank == 'species'
            INSERT v IN rank_extract OPTIONS { ignoreErrors: true }
            INSERT {
            _from: "rank_extract/${key5}",
            _to: concat('rank_extract/', v._key)
            } INTO rank_extracte OPTIONS { ignoreErrors: true }
            return v._key
            `);

                        species = await species.all();
                    }
                }
            }
        }
    }
}
counting();