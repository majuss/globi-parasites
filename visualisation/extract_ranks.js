'use strict';

const db = require('arangojs')();

db.query(`
FOR doc IN nodes_otl
FILTER doc.rank == "class"
UPDATE doc WITH {rank: 'subclass'} IN nodes_otl
`)

db.query(`
FOR doc IN nodes_otl
FILTER doc.rank == "superclass"
UPDATE doc WITH {rank: 'class'} IN nodes_otl
`)

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
/*
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
                    }*/
                }
            }
        }
    }
    console.log("finished extracting metazoa ranks");
/*     
    let nullphylla = await db.query(`
    FOR node in rank_extract
    FILTER 
    node.rank == "phylum" && 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id rank_extracte RETURN v) ||
    node.rank == "phylum" && 0 == LENGTH(FOR v,e IN OUTBOUND node._id rank_extracte FILTER v.parasite == 1 || v.parasitew == 1 RETURN v)
    RETURN node
    `)
    nullphylla = await nullphylla.all();

        for(const node of nullphylla){
        db.query(`
        FOR v,e IN INBOUND '${node._id}' rank_extracte
        REMOVE e IN rank_extracte
        `)
        db.query(`
        REMOVE '${node._key}' IN rank_extract`)
        } */
    /*
    let phylla = await db.query(`
    FOR node in rank_extract
    FILTER node.rank == "phylum"
    RETURN node
    `)
    phylla = await phylla.all();
    
    for(const node of phylla){
    db.query(`
    FOR v,e IN OUTBOUND '${node._id}' rank_extracte
    FILTER 0 = LENGTH(FOR v,e IN OUTBOUND '${node._id}' rank_extracte FILTER v.parasite == 1 || v.parasitew == 1 RETURN v)
    REMOVE v IN rank_extract
    REMOVE e IN rank_extracte
    `)
    }
*/
}
counting();