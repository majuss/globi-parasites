'use strict';
const db = require('arangojs')();
const fs = require('fs');
const jsonexport = require('jsonexport');

async function counting() {

    //sum of origins below or on family
    let origins_family = await db.query(`
    let summe=(FOR node IN 0..100 OUTBOUND 'nodes_otl/691846' edges_otl
    filter node.rank =="family"
    RETURN node.nr_origins_from)
    return SUM(summe)
    `)
    origins_family = await origins_family.all();

    let origins = await db.query(`
    RETURN COUNT(FOR node IN 0..100 OUTBOUND 'nodes_otl/691846' edges_otl
    FILTER node.origin_from == 1
    RETURN node)
    `)
    origins = await origins.all();

    let losses = await db.query(`
    RETURN COUNT(FOR node IN 0..100 OUTBOUND 'nodes_otl/691846' edges_otl
    FILTER node.loss_from == 1
    RETURN node)
    `)
    losses = await losses.all();

    let tables = ["metazoa:691846", "fungi:352914", "plants:5268475", "sar:5246039"]

    for (let i = 0; i < tables.length; i++) {

        let table = await db.query(`
        FOR v,e in 1..100 OUTBOUND 'nodes_otl/${tables[i].split(":")[1]}' edges_otl
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
        cross_count_freeleafs: v.nr_cross_free_leafs,
        sum_leafs: v.sum_leafs,
        percentage: '',
        'inferred parasitic leafs according to both origins': (((100/v.sum_leafs) * v.nr_cross_paras_leafs)/100),
        'inferred free-living leafs according to both origins': (((100/v.sum_leafs) * v.nr_cross_free_leafs)/100),
        'inferred parasitic leafs according to our origins': (((100/v.sum_leafs) * v.nr_leaf_parasites)/100),
        'inferred parasitic leafs according to weinstein origins': (((100/v.sum_leafs) * v.nr_leaf_parasites_weinstein)/100)
        }
        `)
        table = await table.all()

        jsonexport(table, function (err, csv) {
            if (err) return console.log(err);
            fs.writeFileSync("analysis/generated_tables/origins_table_" + tables[i].split(":")[0] + ".csv", csv)
        });
    }
    //on fulltree 1: freeliving && freelivingw; 2: freeliving && parasitew; 3: parasite && parasitew; 4: parasite && freelivingw

    db.query(`
        INSERT {    _key: 'table3',
            origins_underOn_family: ${origins_family},
            origin_count: ${origins},
            losses: ${losses}
         } in counts OPTIONS { ignoreErrors: true }
         `);
    //create table to picture imported data
    for (let i = 0; i < tables.length; i++) {

        let table2 = await db.query(`
        FOR doc,e in 1..100 OUTBOUND 'nodes_otl/${tables[i].split(":")[1]}' edges_otl
        FILTER doc.rank == "class" && doc.nr_sum_leafs_import != null
        SORT doc.name asc        
        RETURN {
        name: doc.name,
        nr_leaf_parasites_import: doc.nr_leaf_parasites_import,
        nr_leaf_freeliving_import: doc.nr_leaf_freeliving_import,
        sum_leafs_import: doc.nr_sum_leafs_import,
        leafs_parasites: doc.nr_leaf_parasites,
        cross_count_freeleafs: doc.nr_cross_free_leafs,
        leafs_parasites_weinstein: doc.nr_leaf_parasites_weinstein,
        sum_leafs: doc.sum_leafs,
        'log transformed': '',
        'log of imported parasitic leafs': LOG10(doc.nr_leaf_parasites_import),
        'log of imported freeliving leafs': LOG10(doc.nr_leaf_freeliving_import),
        'log of inferred parasitic leafs': LOG10(doc.nr_leaf_parasites),
        'log of inferred freeliving leafs': LOG(doc.nr_cross_free_leafs + doc.nr_leaf_parasites_weinstein),
        '% share parasites imported': (((100/doc.sum_leafs_import)*doc.nr_leaf_parasites_import)/100),
        '% share free-living imported': ((100/doc.sum_leafs_import)*doc.nr_leaf_freeliving_import)/100,
        '% share parasites inferred': ((100/doc.sum_leafs)*doc.nr_leaf_parasites)/100,
        '% share free-living inferred': ((100/doc.sum_leafs)*(doc.nr_cross_free_leafs + doc.nr_leaf_parasites_weinstein))/100

        }
        `)
        table2 = await table2.all();

        jsonexport(table2, function (err, csv) {
            if (err) return console.log(err);
            fs.writeFileSync("analysis/generated_tables/input-output_classes_" + tables[i].split(":")[0] + ".csv", csv)
        });
    }
    let table4 = await db.query(`
            FOR doc,e in 1..100 OUTBOUND 'nodes_otl/691846' edges_otl
            FILTER doc.rank == "order" && doc.nr_sum_leafs_import != null
            SORT doc.name asc        
            RETURN {
            name: doc.name,
            nr_leaf_parasites_import: doc.nr_leaf_parasites_import,
            nr_leaf_freeliving_import: doc.nr_leaf_freeliving_import,
            sum_leafs_import: doc.nr_sum_leafs_import,
            leafs_parasites: doc.nr_leaf_parasites,
            cross_count_freeleafs: doc.nr_cross_free_leafs,
            leafs_parasites_weinstein: doc.nr_leaf_parasites_weinstein,
            sum_leafs: doc.sum_leafs,
            'log transformed': '',
            'log of imported parasitic leafs': LOG10(doc.nr_leaf_parasites_import),
            'log of imported freeliving leafs': LOG10(doc.nr_leaf_freeliving_import),
            'log of inferred parasitic leafs': LOG10(doc.nr_leaf_parasites),
            'log of inferred freeliving leafs': LOG(doc.nr_cross_free_leafs + doc.nr_leaf_parasites_weinstein),
            '% share parasites imported': (((100/doc.sum_leafs_import)*doc.nr_leaf_parasites_import)/100),
            '% share free-living imported': ((100/doc.sum_leafs_import)*doc.nr_leaf_freeliving_import)/100,
            '% share parasites inferred': ((100/doc.sum_leafs)*doc.nr_leaf_parasites)/100,
            '% share free-living inferred': ((100/doc.sum_leafs)*(doc.nr_cross_free_leafs + doc.nr_leaf_parasites_weinstein))/100
            }
            `)
    table4 = await table4.all();

    jsonexport(table4, function (err, csv) {
        if (err) return console.log(err);
        fs.writeFileSync("analysis/generated_tables/input-output_order_metazoa.csv", csv)
    });




    let table4 = await db.query(`
    FOR doc,e in 1..100 OUTBOUND 'nodes_otl/NEMTAOD' edges_otl
    FILTER doc.rank == "genus" && doc.nr_sum_leafs_import != null
    SORT doc.name asc        
    RETURN {
    name: doc.name,
    nr_leaf_parasites_import: doc.nr_leaf_parasites_import,
    nr_leaf_freeliving_import: doc.nr_leaf_freeliving_import,
    sum_leafs_import: doc.nr_sum_leafs_import,
    leafs_parasites: doc.nr_leaf_parasites,
    cross_count_freeleafs: doc.nr_cross_free_leafs,
    leafs_parasites_weinstein: doc.nr_leaf_parasites_weinstein,
    sum_leafs: doc.sum_leafs,
    'log transformed': '',
    'log of imported parasitic leafs': LOG10(doc.nr_leaf_parasites_import),
    'log of imported freeliving leafs': LOG10(doc.nr_leaf_freeliving_import),
    'log of inferred parasitic leafs': LOG10(doc.nr_leaf_parasites),
    'log of inferred freeliving leafs': LOG(doc.nr_cross_free_leafs + doc.nr_leaf_parasites_weinstein),
    '% share parasites imported': (((100/doc.sum_leafs_import)*doc.nr_leaf_parasites_import)/100),
    '% share free-living imported': ((100/doc.sum_leafs_import)*doc.nr_leaf_freeliving_import)/100,
    '% share parasites inferred': ((100/doc.sum_leafs)*doc.nr_leaf_parasites)/100,
    '% share free-living inferred': ((100/doc.sum_leafs)*(doc.nr_cross_free_leafs + doc.nr_leaf_parasites_weinstein))/100
    }
    `)
    table4 = await table4.all();

    jsonexport(table4, function (err, csv) {
        if (err) return console.log(err);
        fs.writeFileSync("analysis/generated_tables/input-output_order_nematoda.csv", csv)
    });


    
    let phylla = ["nematoda:395057", "arthropoda:"]

    for (let i = 0; i < tables.length; i++) {

        let nematoda = await db.query(`
        FOR v,e in 1..100 OUTBOUND 'nodes_otl/395057' edges_otl
        FILTER v.rank == "order"
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
        cross_count_freeleafs: v.nr_cross_free_leafs,
        sum_leafs: v.sum_leafs,
        percentage: '',
        'inferred parasitic leafs according to both origins': (((100/v.sum_leafs) * v.nr_cross_paras_leafs)/100),
        'inferred free-living leafs according to both origins': (((100/v.sum_leafs) * v.nr_cross_free_leafs)/100),
        'inferred parasitic leafs according to our origins': (((100/v.sum_leafs) * v.nr_leaf_parasites)/100),
        'inferred parasitic leafs according to weinstein origins': (((100/v.sum_leafs) * v.nr_leaf_parasites_weinstein)/100)
        }
        `)
        nematoda = await nematoda.all()

        jsonexport(nematoda, function (err, csv) {
            if (err) return console.log(err);
            fs.writeFileSync("analysis/generated_tables/origins_table_order_" + tables[i].split(":")[0] + ".csv", csv)
        });
    }
    console.log("finished counts2");
}
counting();


