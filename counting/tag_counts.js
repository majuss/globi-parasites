'use strict';

const db = require('arangojs')();

db.query(
`
FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/304358' edges_otl_sub

    LET paras = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.parasite == 1 RETURN v) 

    LET frees = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.freeliving == 1 RETURN v)
    
    LET cross = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.freeliving == 1 && x.parasite == 1 RETURN v)

    LET origins_from = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.origin_from == 1 RETURN v)

    LET origins_to = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.origin_to == 1 RETURN v)

    LET loss_from = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.loss_from == 1 RETURN v)

    LET loss_to = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.loss_to == 1 RETURN v)

    LET crossw = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.weinstein == 1 && x.globi == 1 RETURN v)

    LET weinstein = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.weinstein == 1 RETURN v)
    
    UPDATE v WITH { nr_parasites: paras,
                    nr_freeliving: frees,
                    nr_crosshits_flp: cross,
                    nr_origins_from: origins_from,
                    nr_origins_to: origins_to,
                    nr_loss_from: loss_from,
                    nr_loss_to: loss_to,
                    nr_cross_hits_with_weinstein: crossw,
                    nr_weinstein: weinstein
                     } in nodes_otl_sub
`);