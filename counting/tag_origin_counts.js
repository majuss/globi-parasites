'use strict';

var db = require('arangojs')();

// kingdom - phlyum - class - order - family - genus

async function counting() {
    
    let kingdomcount = await db.query(`
    FOR v,e IN 1..100 outbound 'otl_parasites_nodes/304358' otl_parasites_edges
    filter v.rank == 'kingdom'
    RETURN v`);

    Object.keys(kingdomcount._result).forEach(async function (key) {
        let countp = await db.query(`
        return count(
        FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${kingdomcount._result[key]._key}' otl_parasites_edges
        FILTER v.origin2 == 1
        RETURN v)`);
        let countf = await db.query(`
        return count(
        FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${kingdomcount._result[key]._key}' otl_parasites_edges
        FILTER v.loss2 == 1
        RETURN v)`);
        db.query(`
        UPDATE "${kingdomcount._result[key]._key}" WITH {
        nr_origins: ${countp._result},
        nr_loss: ${countf._result}
        } IN otl_parasites_nodes`)
        console.log(kingdomcount._result[key].name, kingdomcount._result[key]._key, countp._result, countf._result); // kingdoms 

        let phyllacount = await db.query(`
        FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${kingdomcount._result[key]._key}' otl_parasites_edges
        filter v.rank == 'phylum'
        RETURN v`);

        Object.keys(phyllacount._result).forEach(async function (key) {
            let countp = await db.query(`
            return count(
            FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${phyllacount._result[key]._key}' otl_parasites_edges
            FILTER v.origin2 == 1
            RETURN v)`);
            let countf = await db.query(`
            return count(
            FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${phyllacount._result[key]._key}' otl_parasites_edges
            FILTER v.loss2 == 1
            RETURN v)`);
            db.query(`
            UPDATE "${phyllacount._result[key]._key}" WITH {
            nr_origins: ${countp._result},
            nr_loss: ${countf._result}
            } IN otl_parasites_nodes`)
            console.log(phyllacount._result[key].name, phyllacount._result[key]._key, countp._result, countf._result); // phylla

            let classcount = await db.query(`
            FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${phyllacount._result[key]._key}' otl_parasites_edges
            filter v.rank == 'class'
            RETURN v`);

            Object.keys(classcount._result).forEach(async function (key) {
                let countp = await db.query(`
                return count(
                FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${classcount._result[key]._key}' otl_parasites_edges
                FILTER v.origin2 == 1
                RETURN v)`);
                let countf = await db.query(`
                return count(
                FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${classcount._result[key]._key}' otl_parasites_edges
                FILTER v.loss2 == 1
                RETURN v)`);
                db.query(`
                UPDATE "${classcount._result[key]._key}" WITH {
                nr_origins: ${countp._result},
                nr_loss: ${countf._result}
                } IN otl_parasites_nodes`)
                console.log(classcount._result[key].name, classcount._result[key]._key, countp._result, countf._result); // class

                let ordercount = await db.query(`
                FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${classcount._result[key]._key}' otl_parasites_edges
                filter v.rank == 'order'
                RETURN v`);

                Object.keys(ordercount._result).forEach(async function (key) {
                    let countp = await db.query(`
                    return count(
                    FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${ordercount._result[key]._key}' otl_parasites_edges
                    FILTER v.origin2 == 1
                    RETURN v)`);
                    let countf = await db.query(`
                    return count(
                    FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${ordercount._result[key]._key}' otl_parasites_edges
                    FILTER v.loss2 == 1
                    RETURN v)`);
                    db.query(`
                    UPDATE "${ordercount._result[key]._key}" WITH {
                    nr_origins: ${countp._result},
                    nr_loss: ${countf._result}
                    } IN otl_parasites_nodes`)
                    console.log(ordercount._result[key].name, ordercount._result[key]._key, countp._result, countf._result); // order

                    let familycount = await db.query(`
                    FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${ordercount._result[key]._key}' otl_parasites_edges
                    filter v.rank == 'family'
                    RETURN v`);

                    Object.keys(familycount._result).forEach(async function (key) {
                        let countp = await db.query(`
                        return count(
                        FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${familycount._result[key]._key}' otl_parasites_edges
                        FILTER v.origin2 == 1
                        RETURN v)`);
                        let countf = await db.query(`
                        return count(
                        FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${familycount._result[key]._key}' otl_parasites_edges
                        FILTER v.loss2 == 1
                        RETURN v)`);
                        db.query(`
                        UPDATE "${familycount._result[key]._key}" WITH {
                        nr_origins: ${countp._result},
                        nr_loss: ${countf._result}
                        } IN otl_parasites_nodes`)
                        console.log(familycount._result[key].name, familycount._result[key]._key, countp._result, countf._result); // family

                        let genuscount = await db.query(`
                        FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${familycount._result[key]._key}' otl_parasites_edges
                        filter v.rank == 'family'
                        RETURN v`);

                        Object.keys(genuscount._result).forEach(async function (key) {
                            let countp = await db.query(`
                            return count(
                            FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${genuscount._result[key]._key}' otl_parasites_edges
                            FILTER v.origin2 == 1
                            RETURN v)`);
                            let countf = await db.query(`
                            return count(
                            FOR v,e IN 1..100 outbound 'otl_parasites_nodes/${genuscount._result[key]._key}' otl_parasites_edges
                            FILTER v.loss2 == 1
                            RETURN v)`);
                            db.query(`
                            UPDATE "${genuscount._result[key]._key}" WITH {
                            nr_origins: ${countp._result},
                            nr_loss: ${countf._result}
                            } IN otl_parasites_nodes`)
                            console.log(genuscount._result[key].name, genuscount._result[key]._key, countp._result, countf._result); // genus
                        })
                    })
                })
            })
        })
    })
}
counting();