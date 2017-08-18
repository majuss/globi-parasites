'use strict';

const db = require('arangojs')();

db.query(`
FOR v IN nodes_otl_sub

LET leaf_paras = count(FOR node IN 1..100 OUTBOUND v._id edges_otl_sub
                       FILTER 0 == LENGTH(FOR c,m,p IN OUTBOUND node._id edges_otl_sub RETURN c)
                       FILTER node.parasite == 1
                       RETURN node._id)

LET leaf_free = count(FOR node IN 1..100 OUTBOUND v._id edges_otl_sub
                      FILTER 0 == LENGTH(FOR c IN OUTBOUND node._id edges_otl_sub RETURN c) && node.freeliving == 1 && node.parasite == null
                      RETURN node._id)

LET sumleafs = count(FOR node IN 1..100 OUTBOUND v._id edges_otl_sub
                      FILTER 0 == LENGTH(FOR c,m,p IN OUTBOUND node._id edges_otl_sub RETURN c)
                      RETURN node._id)

LET cross = count(for x IN 1..100 OUTBOUND v edges_otl_sub
FILTER x.freeliving == 1 && x.parasite == 1 RETURN v._id)

LET origins_from = count(for x IN 1..100 OUTBOUND v edges_otl_sub
FILTER x.origin_from == 1 RETURN v._id)

LET origins_to = count(for x IN 1..100 OUTBOUND v edges_otl_sub
FILTER x.origin_to == 1 RETURN v._id)

LET loss_from = count(for x IN 1..100 OUTBOUND v edges_otl_sub
FILTER x.loss_from == 1 RETURN v._id)

LET loss_to = count(for x IN 1..100 OUTBOUND v edges_otl_sub
FILTER x.loss_to == 1 RETURN v._id)
    
UPDATE v WITH { nr_leaf_parasites_import: leaf_paras,
                nr_leaf_freeliving_import: leaf_free,
                nr_sum_leafs_import: sumleafs,
                nr_crosshits_flp: cross,
                nr_origins_from: origins_from,
                nr_origins_to: origins_to,
                nr_loss_from: loss_from,
                nr_loss_to: loss_to
                } in nodes_otl_sub
`);