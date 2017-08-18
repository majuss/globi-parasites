'use strict';

const db = require('arangojs')();
const ranks = ["domain", "phylum", "kingdom", "class", "order", "family", "genus"]

for (let i = 0; i < ranks.length; i++) {

    db.query(
            `
    FOR v,e IN 0..100 OUTBOUND 'nodes_otl_sub/304358' edges_otl_sub
    FILTER v.rank == "${ranks[i]}"

    LET leaf_paras = count(FOR node IN 0..100 OUTBOUND v._id edges_otl_sub
    FILTER 0 == LENGTH(FOR c,m,p IN OUTBOUND node._id edges_otl_sub RETURN c)
    FILTER node.parasite == 1
    RETURN node._id)

    LET free = count(FOR node IN 0..100 OUTBOUND v._id edges_otl_sub
    FILTER node.freeliving
    RETURN node._id)

    LET paras = count(FOR node IN 0..100 OUTBOUND v._id edges_otl_sub
    FILTER node.parasite == 1
    RETURN node._id)

    LET sum_leafs = count(FOR node IN 0..100 OUTBOUND v._id edges_otl_sub
    FILTER 0 == LENGTH(FOR c,m,p IN OUTBOUND node._id edges_otl_sub RETURN c)
    RETURN node._id)

    LET nr_origins = count(FOR node IN 0..100 OUTBOUND v._id edges_otl_sub
    FILTER node.origin_from == 1
    RETURN node._id)

    UPDATE v WITH { 
                    nr_leaf_parasites_import: leaf_paras,
                    nr_parasites: paras,
                    nr_leaf_freeliving_import: free,
                    sum_leafs_import: sum_leafs,
                    nr_from_origins: nr_origins
                } in nodes_otl_sub
`);
}