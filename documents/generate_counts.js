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

let parasites_interaction_nd = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.parasite == 1
    return doc)`);

let parasites_interaction_d = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.parasite == 1
    return distinct doc.pname`);

let freeliving_interaction_nd = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.freeliving == 1
    return doc.fname)`);

let freeliving_interaction_d = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.freeliving == 1
    return distinct doc.fname)`);

let noottparasitesd = await db.query(`
return count(
    for doc in interaction_tsv
    filter parasite == 1
    filter !contains(doc.sourceTaxonIds, "OTT:")
    return doc.pname`);

let noottparasitesnd = await db.query(`
return count(
    for doc in interaction_tsv
    filter parasite == 1
    filter !contains(doc.sourceTaxonIds, "OTT:")
    return distinct doc.pname`);

let noottfreelivingd = await db.query(`
return count(
    for doc in interaction_tsv
    filter freeliving == 1
    filter !contains(doc.sourceTaxonIds, "OTT:")
    return doc.fname`);

let noottfreelivingnd = await db.query(`
return count(
    for doc in interaction_tsv
    filter freeliving == 1
    filter !contains(doc.sourceTaxonIds, "OTT:")
    return distinct doc.fname`);

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
            InteractionParasitesNotDistinct: ${parasites_interaction_nd._result},
            InteractionParasitesDistinct: ${parasites_interaction_d._result},
            NoOTT-IDParasitesNonDistinct: (100 / ${parasites_interaction_nd._result}) * ${noottparasitesnd._result} ${noottparasitesnd._result},
            NoOTT-IDParasitesDistinct: ${noottparasitesd._result},
            InteractionFreelivingNotDistinct: ${freeliving_interaction_nd._result },
            InteractionFreelivingDistinct: ${freeliving_interaction_d._result },
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