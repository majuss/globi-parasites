'use strict';
const db = require('arangojs')();

async function counting() {

let crossCount = await db.query(`
return count(
    for doc in nodes_otl_sub
    filter doc.parasite == 1 && doc.freeliving == 1
    return doc)`);
crossCount = await crossCount.all();

let crossCountLeafsMeta = await db.query(`
return count(
FOR node IN 0..100 OUTBOUND 'nodes_otl_sub/691846' edges_otl_sub
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl_sub RETURN v)
    FILTER node.parasite == 1 && node.freeliving == 1
    RETURN node._id)`)
crossCountLeafsMeta = await crossCountLeafsMeta.all();

let crossCountMeta = await db.query(`
return count(
    for doc in 0..100 OUTBOUND 'nodes_otl_sub/691846' edges_otl_sub
    filter doc.parasite == 1 && doc.freeliving == 1
    return doc)`);
crossCountMeta = await crossCountMeta.all();

let crossCountLeafs = await db.query(`
return count(
FOR node IN nodes_otl_sub
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl_sub RETURN v)
    FILTER node.parasite == 1 && node.freeliving == 1
    RETURN node._id)`)
    crossCountLeafs = await crossCountLeafs.all();

let parasites_interaction_nd = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.parasite == 1
    return doc)`);
    parasites_interaction_nd = await parasites_interaction_nd.all()

let parasites_interaction_d = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.parasite == 1
    return distinct doc.pname)`);
    parasites_interaction_d = await parasites_interaction_d.all()

let freeliving_interaction_nd = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.freeliving == 1
    return doc.fname)`);
    freeliving_interaction_nd = await freeliving_interaction_nd.all()

let freeliving_interaction_d = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.freeliving == 1
    return distinct doc.fname)`);
    freeliving_interaction_d = await freeliving_interaction_d.all()

let noott_parasites_d = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.parasite == 1 && !contains(doc.sourceTaxonIds, "OTT:")
    return distinct doc.pname)`);
    noott_parasites_d = await noott_parasites_d.all();

let noott_parasites_nd = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.parasite == 1 && !contains(doc.sourceTaxonIds, "OTT:")
    return doc.pname)`);
    noott_parasites_nd = await noott_parasites_nd.all();

let noott_freeliving_d = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.freeliving == 1 && !contains(doc.sourceTaxonIds, "OTT:")
    return distinct doc.fname)`);
    noott_freeliving_d = await noott_freeliving_d.all();

let noott_freeliving_nd = await db.query(`
return count(
    for doc in interaction_tsv
    filter doc.freeliving == 1 && !contains(doc.sourceTaxonIds, "OTT:")
    return doc.fname)`);
    noott_freeliving_nd = await noott_freeliving_nd.all();

let parasites = await db.query(`
return count(
    for doc in nodes_otl_sub
    filter doc.parasite == 1
    return doc)`);
    parasites = await parasites.all();

let freeliving = await db.query(`
return count(
    for doc in nodes_otl_sub
    filter doc.freeliving == 1
    return doc)`);
    freeliving = await freeliving.all();

let fungi = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/352914' edges_otl_sub
    FILTER v.parasite == 1
    RETURN v)`);
    fungi = await fungi.all();

let fungif = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/352914' edges_otl_sub
    FILTER v.freeliving == 1
    RETURN v)`);
    fungif = await fungif.all();

let metazoa = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/691846' edges_otl_sub
    FILTER v.parasite == 1
    RETURN v)`);
    metazoa = await metazoa.all();

let metazoaf = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/691846' edges_otl_sub
    FILTER v.freeliving == 1
    RETURN v)`);
    metazoaf = await metazoaf.all();

let plants = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/5268475' edges_otl_sub
    FILTER v.parasite == 1
    RETURN v)`);
    plants = await plants.all(); 

let plantsf = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/5268475' edges_otl_sub
    FILTER v.freeliving == 1
    RETURN v)`);
    plantsf = await plantsf.all();

let amebes = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/1064655' edges_otl_sub
    FILTER v.parasite == 1
    RETURN v)`);
    amebes = await amebes.all();

let amebesf = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/1064655' edges_otl_sub
    FILTER v.freeliving == 1
    RETURN v)`);
    amebesf = await amebesf.all();

let sar = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/5246039' edges_otl_sub
    FILTER v.parasite == 1
    RETURN v)`);
    sar = await sar.all();

let sarf = await db.query(`
return count(
FOR v,e IN 1..100 outbound 'nodes_otl_sub/5246039' edges_otl_sub
    FILTER v.freeliving == 1
    RETURN v)`);
    sarf = await sarf.all();

let para_leafs_sub = await db.query(`
return count(
FOR node IN nodes_otl_sub
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl_sub RETURN v)
    FILTER node.parasite == 1
    RETURN node._id)`)
    para_leafs_sub = await para_leafs_sub.all()

let para_leafs_meta_full = await db.query(`
return count(
FOR node IN 0..100 OUTBOUND 'nodes_otl/691846' edges_otl 
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl RETURN v)
    FILTER node.parasite == 1
    RETURN node._id)`)
    para_leafs_meta_full = await para_leafs_meta_full.all();

let para_leafs_meta_sub = await db.query(`
return count(
FOR node IN 0..100 OUTBOUND 'nodes_otl_sub/691846' edges_otl_sub
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl_sub RETURN v)
    FILTER node.parasite == 1
    RETURN node._id)`)
    para_leafs_meta_sub = await para_leafs_meta_sub.all();


let free_leafs_sub = await db.query(`
return count(
FOR node IN nodes_otl_sub
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl_sub RETURN v)
    FILTER node.freeliving == 1
    RETURN node._id)`)
    free_leafs_sub = await free_leafs_sub.all();

let para_leafs_full = await db.query(`
return count(
FOR node IN nodes_otl
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl RETURN v)
    FILTER node.parasite == 1
    RETURN node._id)`)
    para_leafs_full = await para_leafs_full.all();

let free_leafs_full = await db.query(`
return count(
FOR node IN nodes_otl
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl RETURN v)
    FILTER node.freeliving == 1
    RETURN node._id)
    `)
    free_leafs_full = await free_leafs_full.all();

let para_full = await db.query(`
return count(
    FOR node IN nodes_otl
    FILTER node.parasite == 1
    RETURN node)
    `)
    para_full = await para_full.all();

let free_full = await db.query(`
return count(
    FOR node IN nodes_otl
    FILTER node.freeliving == 1
    RETURN node)
    `)
    free_full = await free_full.all();

let para_full_wein = await db.query(`
return count(
    FOR node IN nodes_otl
    FILTER node.parasitew == 1
    RETURN node)
    `)
    para_full_wein = await para_full_wein.all();

let para_leafs_full_wein = await db.query(`
return count(
FOR node IN 0..100 OUTBOUND 'nodes_otl/691846' edges_otl
    FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id edges_otl RETURN v)
    FILTER node.parasitew == 1
    RETURN node._id)
    `)
    para_leafs_full_wein = await para_leafs_full_wein.all();

let origins = await db.query(`
RETURN count(
    FOR node IN nodes_otl
    FILTER node.origin_from == 1
    Return node._id
)
`)
    origins = await origins.all()

let origins_metazoa = await db.query(`
    RETURN count(
        FOR node IN 0..100 OUTBOUND 'nodes_otl/691846' edges_otl
        FILTER node.origin_from == 1
        Return node._id
    )
    `)
        origins_metazoa = await origins_metazoa.all()

let origins_fungi = await db.query(`
    RETURN count(
        FOR node IN 0..100 OUTBOUND 'nodes_otl/352914' edges_otl
        FILTER node.origin_from == 1
        Return node._id
    )
    `)
        origins_fungi = await origins_fungi.all()

let origins_plants = await db.query(`
    RETURN count(
        FOR node IN 0..100 OUTBOUND 'nodes_otl/5268475' edges_otl
        FILTER node.origin_from == 1
        Return node._id
    )
    `)
        origins_plants = await origins_plants.all()

let origins_sar = await db.query(`
    RETURN count(
        FOR node IN 0..100 OUTBOUND 'nodes_otl/5246039' edges_otl
        FILTER node.origin_from == 1
        Return node._id
    )
    `)
        origins_sar = await origins_sar.all()

let percent_noott_parasites_nd = ((100 / parasites_interaction_nd) * noott_parasites_nd).toFixed(2);
let percent_noott_parasites_d = ((100 / parasites_interaction_d) * noott_parasites_d).toFixed(2);
let percent_noott_freeliving_nd = ((100 / freeliving_interaction_nd) * noott_freeliving_nd).toFixed(2);
let percent_noott_freeliving_d = ((100 / freeliving_interaction_d) * noott_freeliving_d).toFixed(2);



db.query(`
INSERT {    _key: 'table',
            'Parasite x Freeliving': ${await crossCount},
            'Interaction Parasites (notdistinct)': ${await parasites_interaction_nd},
            'Interaction Parasites (distinct)': ${await parasites_interaction_d},
            'No OTT-ID Parasites (nondistinct)': '${await noott_parasites_nd} (${percent_noott_parasites_nd}%)',
            'No OTT-ID Parasites (distinct)': '${await noott_parasites_d} (${percent_noott_parasites_d}%)',
            'No OTT-ID freeliving (nondistinct)': '${await noott_freeliving_nd} (${percent_noott_freeliving_nd}%)',
            'No OTT-ID freeliving (distinct)': '${await noott_freeliving_d} (${percent_noott_freeliving_d}%)',
            'Interaction Freeliving (notdistinct)': ${await freeliving_interaction_nd },
            'Interaction Freeliving (distinct)': ${await freeliving_interaction_d },
            'Parasite Count': ${await parasites},
            'Freeliving Count': ${await freeliving},
            'Fungi Parasites': ${await fungi},
            'Fungi freeliving': ${await fungif},
            'Metazoa Parasites': ${await metazoa},
            'Metazoa freeliving': ${await metazoaf},
            'Plant Parasites': ${await plants},
            'Plant freeliving': ${await plantsf},
            'Amebe Parasites': ${await amebes},
            'Amebe freeliving': ${await amebesf},
            'SAR Parasites': ${await sar},
            'SAR freeliving': ${await sarf},
            'Parasitic leafs in subtree according to our origins': ${await para_leafs_sub},
            'Freeliving leafs in subtree according to our origins': ${await free_leafs_sub},
            'Parasitic leafs in fulltree according to our origins': ${await para_leafs_full},
            'Freeliving leafs in fulltree according to our origins': ${await free_leafs_full},
            'Parasites in fulltree according to our origins': ${await para_full},
            'Freeliving in fulltree according to our origins': ${await free_full},
            'Parasitic leafs in subtree according to weinstein': ${await para_leafs_full_wein},
            'Parasites in fulltree according to weinstein': ${await para_full_wein},
            'Metazoan paraistic leaf nodes in fulltree: our origins': ${await para_leafs_meta_full},
            'Metazoan paraistic leaf nodes in subtree: our origins': ${await para_leafs_meta_sub},
            'Crosses leafs': ${await crossCountLeafs},
            'Crosses leafs in Metazoa': ${await crossCountLeafsMeta},
            'Crosses in Metazoa': ${await crossCountMeta},
            'origin overall from': ${await origins},
            'origins in Metazoa from': ${await origins_metazoa},
            'origins in funi': ${await origins_fungi},
            'origins in plants': ${await origins_plants},
            'origins in sar': ${await origins_sar}
         } in counts`);
            console.log("Finished counts1")
}
counting();