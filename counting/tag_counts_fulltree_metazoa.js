'use strict';

const db = require('arangojs')();
const ranks = ["phylum", "kingdom", "class", "order", "family"]

for (let i = 0; i < ranks.length; i++) {

db.query(
`
FOR v,e IN 0..100 OUTBOUND 'nodes_otl/304358' edges_otl
FILTER v.rank == "${ranks[i]}"

LET origins_from = count(for x IN 0..100 OUTBOUND v edges_otl
                FILTER x.origin_from == 1 RETURN v) 

LET loss_from = count(for x IN 0..100 OUTBOUND v edges_otl
                FILTER x.loss_from == 1 RETURN v)

LET origins_to = count(for x IN 0..100 OUTBOUND v edges_otl
                FILTER x.origin == 1 RETURN v) 

LET origins_w = count(for x IN 0..100 OUTBOUND v edges_otl
                FILTER x.originw == 1 RETURN v)

LET leaf_paras = count(FOR node IN 0..100 OUTBOUND v._id edges_otl
    FILTER 0 == LENGTH(FOR c,m,p IN OUTBOUND node._id edges_otl RETURN c)
    FILTER node.parasite == 1 && node.freelivingw == 1
    RETURN node._id)

LET leaf_parasw = count(FOR node IN 0..100 OUTBOUND v._id edges_otl
    FILTER 0 == LENGTH(FOR c,m,p IN OUTBOUND node._id edges_otl RETURN c)
    FILTER node.parasitew == 1 && node.freeliving == 1
    RETURN node._id)

LET leaf_freecross = count(FOR node IN 0..100 OUTBOUND v._id edges_otl
    FILTER 0 == LENGTH(FOR c,m,p IN OUTBOUND node._id edges_otl RETURN c)
    FILTER node.freelivingw == 1 && node.freeliving == 1
    RETURN node._id)

LET leaf_parascross = count(FOR node IN 0..100 OUTBOUND v._id edges_otl
    FILTER 0 == LENGTH(FOR c,m,p IN OUTBOUND node._id edges_otl RETURN c)
    FILTER node.parasitew == 1 && node.parasite == 1
    RETURN node._id)

LET sum_leafs = count(FOR node IN 0..100 OUTBOUND v._id edges_otl
    FILTER 0 == LENGTH(FOR c,m,p IN OUTBOUND node._id edges_otl RETURN c)
    RETURN node._id)

UPDATE v WITH { nr_origins_from: origins_from,
                nr_losses_from: loss_from,
                nr_leaf_parasites: leaf_paras,
                nr_leaf_parasites_weinstein: leaf_parasw,
                nr_origins_to: origins_to,
                nr_origins_toweinstein: origins_w,
                nr_cross_paras_leafs: leaf_parascross,
                nr_cross_free_leafs: leaf_freecross,
                sum_leafs: sum_leafs
            } in nodes_otl
`);
}
