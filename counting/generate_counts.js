'use strict';
const db = require('arangojs')();

async function counting() {

let crossCount = await db.query(`
return count(
    for doc in nodes_otl_sub
    filter doc.parasite == 1 && doc.freeliving == 1
    return doc)`);

let crossCountLeafsMeta = await db.query(`
return count(
FOR node IN 0..100 OUTBOUND 'nodes_otl_sub/691846' edges_otl_sub
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl_sub RETURN v)
    FILTER node.parasite == 1 && doc.freeliving == 1
    RETURN node._id)`)

let crossCountMeta = await db.query(`
return count(
    for doc in 0..100 OUTBOUND 'nodes_otl_sub/691846' edges_otl_sub
    filter doc.parasite == 1 && doc.freeliving == 1
    return doc)`);

let crossCountLeafs = await db.query(`
return count(
FOR node nodes_otl_sub
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl_sub RETURN v)
    FILTER node.parasite == 1 && doc.freeliving == 1
    RETURN node._id)`)

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
    return distinct doc.fname)`);

let noott_freeliving_nd = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.freeliving == 1 && !contains(doc.sourceTaxonIds, "OTT:")
    return doc.fname)`);

let parasites = await db.query(`
return count(
    for doc in nodes_otl_sub
    filter doc.parasite == 1
    return doc)`);

let freeliving = await db.query(`
return count(
    for doc in nodes_otl_sub
    filter doc.freeliving == 1
    return doc)`);

let fungi = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/352914' edges_otl_sub
    FILTER v.parasite == 1
    RETURN v)`);

let fungif = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/352914' edges_otl_sub
    FILTER v.freeliving == 1
    RETURN v)`);

let metazoa = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/691846' edges_otl_sub
    FILTER v.parasite == 1
    RETURN v)`);

let metazoaf = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/691846' edges_otl_sub
    FILTER v.freeliving == 1
    RETURN v)`);

let plants = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/5268475' edges_otl_sub
    FILTER v.parasite == 1
    RETURN v)`);

let plantsf = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/5268475' edges_otl_sub
    FILTER v.freeliving == 1
    RETURN v)`);

let amebes = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/1064655' edges_otl_sub
    FILTER v.parasite == 1
    RETURN v)`);

let amebesf = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/1064655' edges_otl_sub
    FILTER v.freeliving == 1
    RETURN v)`);

let sar = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/5246039' edges_otl_sub
    FILTER v.parasite == 1
    RETURN v)`);

let sarf = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/5246039' edges_otl_sub
    FILTER v.freeliving == 1
    RETURN v)`);

let para_leafs_sub = await db.query(`
return count(
FOR node IN nodes_otl_sub
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl_sub RETURN v)
    FILTER node.parasite == 1
    RETURN node._id)`)

let para_leafs_meta_full = await db.query(`
return count(
FOR node IN 0..100 OUTBOUND 'nodes_otl/691846' edges_otl 
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl RETURN v)
    FILTER node.parasite == 1
    RETURN node._id)`)

let para_leafs_meta_sub = await db.query(`
return count(
FOR node IN 0..100 OUTBOUND 'nodes_otl_sub/691846' edges_otl_sub
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl_sub RETURN v)
    FILTER node.parasite == 1
    RETURN node._id)`)


let free_leafs_sub = await db.query(`
return count(
FOR node IN nodes_otl_sub
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl_sub RETURN v)
    FILTER node.freeliving == 1
    RETURN node._id)`)

let para_leafs_full = await db.query(`
return count(
FOR node IN nodes_otl
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl RETURN v)
    FILTER node.parasite == 1
    RETURN node._id)`)

let free_leafs_full = await db.query(`
return count(
FOR node IN nodes_otl
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl RETURN v)
    FILTER node.freeliving == 1
    RETURN node._id)`)

let para_full = await db.query(`
return count(
    FOR node IN nodes_otl
    FILTER node.parasite == 1
    RETURN node)`)

let free_full = await db.query(`
return count(
    FOR node IN nodes_otl
    FILTER node.freeliving == 1
    RETURN node)`)

let para_full_wein = await db.query(`
return count(
    FOR node IN nodes_otl
    FILTER node.parasitew == 1
    RETURN node)`)

let para_leafs_full_wein = await db.query(`
return count(
FOR node IN 0..100 OUTBOUND 'nodes_otl/691846' edges_otl
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl RETURN v)
    FILTER node.parasitew == 1
    RETURN node._id)`)

let percent_noott_parasites_nd = ((100 / parasites_interaction_nd._result) * noott_parasites_nd._result).toFixed(2);
let percent_noott_parasites_d = ((100 / parasites_interaction_d._result) * noott_parasites_d._result).toFixed(2);
let percent_noott_freeliving_nd = ((100 / freeliving_interaction_nd._result) * noott_freeliving_nd._result).toFixed(2);
let percent_noott_freeliving_d = ((100 / freeliving_interaction_d._result) * noott_freeliving_d._result).toFixed(2);



db.query(`
INSERT {    _key: 'table',
            'Parasite x Freeliving': ${crossCount._result},
            'Interaction Parasites (notdistinct)': ${parasites_interaction_nd._result},
            'Interaction Parasites (distinct)': ${parasites_interaction_d._result},
            'No OTT-ID Parasites (nondistinct)': '${noott_parasites_nd._result} (${percent_noott_parasites_nd}%)',
            'No OTT-ID Parasites (distinct)': '${noott_parasites_d._result} (${percent_noott_parasites_d}%)',
            'No OTT-ID freeliving (nondistinct)': '${noott_freeliving_nd._result} (${percent_noott_freeliving_nd}%)',
            'No OTT-ID freeliving (distinct)': '${noott_freeliving_d._result} (${percent_noott_freeliving_d}%)',
            'Interaction Freeliving (notdistinct)': ${freeliving_interaction_nd._result },
            'Interaction Freeliving (distinct)': ${freeliving_interaction_d._result },
            'Parasite Count': ${parasites._result},
            'Freeliving Count': ${freeliving._result},
            'Fungi Parasites': ${fungi._result},
            'Fungi freeliving': ${fungif._result},
            'Metazoa Parasites': ${metazoa._result},
            'Metazoa freeliving': ${metazoaf._result},
            'Plant Parasites': ${plants._result},
            'Plant freeliving': ${plantsf._result},
            'Amebe Parasites': ${amebes._result},
            'Amebe freeliving': ${amebesf._result},
            'SAR Parasites': ${sar._result},
            'SAR freeliving': ${sarf._result},
            'Parasitic leafs in subtree according to our origins': ${para_leafs_sub._result},
            'Freeliving leafs in subtree according to our origins': ${free_leafs_sub._result},
            'Parasitic leafs in fulltree according to our origins': ${para_leafs_full._result},
            'Freeliving leafs in fulltree according to our origins': ${free_leafs_full._result},
            'Parasites in fulltree according to our origins': ${para_full._result},
            'Freeliving in fulltree according to our origins': ${free_full._result},
            'Parasitic leafs in subtree according to weinstein': ${para_leafs_full_wein._result},
            'Parasites in fulltree according to weinstein': ${para_full_wein._result},
            'Metazoan paraistic leaf nodes in fulltree: our origins': ${para_leafs_meta_full._result},
            'Metazoan paraistic leaf nodes in subtree: our origins': ${para_leafs_meta_sub._result}
            'Crosses leafs:'${crossCountLeafs._result},
            'Crosses leafs in Metazoa:'${crossCountLeafsMeta._result},
            'Crosses in Metazoa:'${crossCountMeta._result}
         } in counts`);
}
counting();