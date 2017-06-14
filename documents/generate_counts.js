'use strict';
const db = require('arangojs')();
db.query(`REMOVE "table" IN counts`);

async function counting() {

let crossCount = await db.query(`
return count(
for doc in otl_parasites_nodes
filter doc.parasite == 1 && doc.freeliving == 1
return doc)`);

let globiP = await db.query(`
return count(
    for doc in otl_parasites_nodes
    filter doc.parasite == 1 && doc.globi == 1
    return doc)`);

let weinstein = await db.query(`
return count(
    for doc in otl_parasites_nodes
    filter doc.weinstein == 1
    return doc)`);

let weinsteinglobi = await db.query(`
return count(
    for doc in otl_parasites_nodes
    filter doc.globi == 1 && doc.weinstein == 1
    return doc)`);

let parasites = await db.query(`
return count(
    for doc in otl_parasites_nodes
    filter doc.parasite == 1
    return doc)`);

let freeliving = await db.query(`
return count(
    for doc in otl_parasites_nodes
    filter doc.freeliving == 1
    return doc)`);

let fungi = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'otl_parasites_nodes/352914' otl_parasites_edges
    FILTER v.parasite == 1
    RETURN v)`);

let metazoa = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'otl_parasites_nodes/691846' otl_parasites_edges
    FILTER v.parasite == 1
    RETURN v)`);

let plants = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'otl_parasites_nodes/5268475' otl_parasites_edges
    FILTER v.parasite == 1
    RETURN v)`);

let amebes = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'otl_parasites_nodes/1064655' otl_parasites_edges
    FILTER v.parasite == 1
    RETURN v)`);

let sar = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'otl_parasites_nodes/5246039' otl_parasites_edges
    FILTER v.parasite == 1
    RETURN v)`);

    

db.query(`
INSERT {    _key: 'table',
            crossCount: ${crossCount._result},
            globiParasites: ${globiP._result},
            weinsteinParasites: ${weinstein._result},
            weinsteinGlobiParasites: ${weinsteinglobi._result},
            parasiteCount: ${parasites._result},
            freelivingCount: ${freeliving._result},
            fungiParasites: ${fungi._result},
            metazoaParasites: ${metazoa._result},
            plantParasites: ${plants._result},
            amebeParasites: ${amebes._result},
            SARParasites: ${sar._result} } in counts`);
}

counting();