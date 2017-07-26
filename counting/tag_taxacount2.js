'use strict'

const db = require('arangojs')();

db.query(
    `
    FOR v in nodes_otl_sub
        FILTER v.origin_from == 1
        LET taxa = count(FOR x IN 1..100 OUTBOUND concat('nodes_otl/', v._key) edges_otl
            Return v)
    UPDATE v WITH {nr_underlying_taxa: taxa } IN nodes_otl_sub
`)