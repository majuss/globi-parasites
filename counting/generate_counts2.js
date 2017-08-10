'use strict';
const db = require('arangojs')();
const fs = require('fs');

async function counting() {

//sum of origins below or on family
let origins_family = await db.query(`
    let summe=(FOR node IN 0..100 OUTBOUND 'nodes_otl/691846' edges_otl
    filter node.rank =="family"
    RETURN node.nr_origins_from)
    return SUM(summe)
    `)


let table1 = await db.query(`
    FOR v,e in 1..100 OUTBOUND 'nodes_otl/691846' edges_otl
    FILTER v.rank == "phylum" || v.name == "Sipucula"
    SORT v.name asc
    RETURN {
    name: v.name,
    origins: v.nr_origins_from,
    to_origins: v.nr_origins_to,
    losses: v.nr_losses_from,
    weinstein_origins: v.nr_originw_from,
    to_origins_wein: v.nr_origins_toweinstein,
    leafs_parasites: v.nr_leaf_parasites,
    leafs_parasites_weinstein: v.nr_leaf_parasites_weinstein,
    cross_count_paraleafs: v.nr_cross_paras_leafs,
    cross_count_freeleafs: v.nr_cross_free_leafs
    }
    `)
//on fulltree 1: freeliving && freelivingw; 2: freeliving && parasitew; 3: parasite && parasitew; 4: parasite && freelivingw

db.query(`
INSERT {    _key: 'table2',
         } in counts`);

fs.writeFileSync('analysis/generated_tables/extrapolated_table.json', JSON.stringify(table1.all(), false, 2));

        }

counting();


