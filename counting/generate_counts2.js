'use strict';
const db = require('arangojs')();
const fs = require('fs');
const jsonexport = require('jsonexport');

                //name of group:OTT-ID:rank to filter:purpose
let toprint = [ "Metazoa:691846:phylum:origins",
                "Metazoa:691846:class:correlation",
                "Metazoa:691846:family:correlation",
                "Nematoda:395057:order:origins",
                "Nematoda:395057:family:correlation",
                "Arthropoda:632179:order:origins",
                "Arthropoda:632179:family:correlation",
                "Fungi:352914:phylum:origins",
                "Fungi:352914:class:correlation",
                "Fungi:352914:family:correlation",
                "Plants:5268475:phylum:origins",
                "Plants:5268475:class:correlation",
                "Plants:5268475:family:correlation",
                "SAR:5246039:phylum:origins",
                "SAR:5246039:class:correlation",
                "SAR:5246039:genus:correlation"
            ]

async function generate() {

    for (let i = 0; i < toprint.length; i++) {

    let table = await db.query(`
    FOR v,e in 1..100 OUTBOUND 'nodes_otl/${toprint[i].split(":")[1]}' edges_otl
    FILTER v.rank == '${toprint[i].split(":")[2]}' && v.nr_sum_leafs_import != null
    SORT v.name asc
    RETURN {
    'name':                           v.name,
    'origins(parent)':                v.nr_origins_from,
    'origins(children)':              v.nr_origins_to,
    'losses(parent)':                 v.nr_losses_from,
    'weinstein_origins(parent)':      v.nr_originw_from,
    'weinstein_origins(children)':    v.nr_origins_toweinstein,
    'leafs_parasites':                v.nr_leaf_parasites,
    'leafs_parasites_weinstein':      v.nr_leaf_parasites_weinstein,
    'nr_leaf_parasites_import':       v.nr_leaf_parasites_import,
    'nr_leaf_freeliving_import':      v.nr_leaf_freeliving_import,
    'cross_count_paraleafs':          v.nr_cross_paras_leafs,
    'cross_count_freeleafs':          v.nr_cross_free_leafs,
    'sum_leafs':                      v.sum_leafs,
    'sum_leafs_import':               v.nr_sum_leafs_import,
    'percentage comparison': '',
    'inferred parasitic leafs according to both origins':       ((100/v.sum_leafs) *v.nr_cross_paras_leafs)/100,
    'inferred freeliving leafs according to both origins':      ((100/v.sum_leafs) *v.nr_cross_free_leafs)/100,
    'inferred parasitic leafs according to our origins':        ((100/v.sum_leafs) *v.nr_leaf_parasites)/100,
    'inferred parasitic leafs according to weinstein origins':  ((100/v.sum_leafs) *v.nr_leaf_parasites_weinstein)/100,
    'log transformed': '',
    'log of imported parasitic leafs':  LOG10(v.nr_leaf_parasites_import),
    'log of imported freeliving leafs': LOG10(v.nr_leaf_freeliving_import),
    'log of inferred parasitic leafs':  LOG10(v.nr_leaf_parasites),
    'log of inferred freeliving leafs': LOG10(v.nr_cross_free_leafs + v.nr_leaf_parasites_weinstein),
    'percentage correlation': '',
    '% share parasites imported':   ((100/v.sum_leafs_import)*v.nr_leaf_parasites_import)/100,
    '% share freeliving imported':  ((100/v.sum_leafs_import)*v.nr_leaf_freeliving_import)/100,
    '% share parasites inferred':   ((100/v.sum_leafs)*v.nr_leaf_parasites)/100,
    '% share freeliving inferred':  ((100/v.sum_leafs)*(v.nr_cross_free_leafs + v.nr_leaf_parasites_weinstein))/100
    }
    `)
    table = await table.all();

    jsonexport(table, function (err, csv) {
        if (err) return console.log(err);
        fs.writeFileSync("analysis/generated_tables/" + toprint[i].split(":")[3] + "_" + toprint[i].split(":")[2] + "_" + toprint[i].split(":")[0] + ".csv", csv)
    });
}
}

generate();