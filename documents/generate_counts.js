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
    return distinct doc.pname)`);

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

let noott_parasites_d = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.parasite == 1 && !contains(doc.sourceTaxonIds, "OTT:")
    return distinct doc.pname)`);

let noott_parasites_nd = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.parasite == 1 && !contains(doc.sourceTaxonIds, "OTT:")
    return doc.pname)`);

let noott_freeliving_d = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.freeliving == 1 && !contains(doc.sourceTaxonIds, "OTT:")
    return doc.fname)`);

let noott_freeliving_nd = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.freeliving == 1 && !contains(doc.sourceTaxonIds, "OTT:")
    return distinct doc.fname)`);

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


let percent_noott_parasites_nd = ((100 / parasites_interaction_nd._result) * noott_parasites_nd._result).toFixed(2);
let percent_noott_parasites_d = ((100 / parasites_interaction_d._result) * noott_parasites_d._result).toFixed(2);


db.query(`
INSERT {    _key: 'table',
            'Parasite x Freeliving': ${crossCount._result},
            'GLoBI Parasites': ${globiP._result},
            'Interaction Parasites (notdistinct)': ${parasites_interaction_nd._result},
            'Interaction Parasites (distinct)': ${parasites_interaction_d._result},
            'No OTT-ID Parasites (nondistinct)': '${noott_parasites_nd._result} (${percent_noott_parasites_nd}%)',
            'No OTT-ID Parasites (distinct)': '${noott_parasites_d._result} (${percent_noott_parasites_d}%)',
            'Interaction Freeliving (notdistinct)': ${freeliving_interaction_nd._result },
            'Interaction Freeliving (distinct)': ${freeliving_interaction_d._result },
            'Weinstein Parasites': ${weinstein._result},
            'Weinstein x GLoBI Parasites': ${weinsteinglobi._result},
            'Parasite Count': ${parasites._result},
            'Freeliving Count': ${freeliving._result},
            'Fungi Parasites': ${fungi._result},
            'Metazoa Parasites': ${metazoa._result},
            'Plant Parasites': ${plants._result},
            'Amebe Parasites': ${amebes._result},
            'SAR Parasites': ${sar._result} } in counts`);
}

counting();