'use strict';

const db = require('arangojs')();

db.query(
`
FOR v,e IN 1..100 OUTBOUND 'nodes_otl_sub/304358' edges_otl_sub

    LET paras = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.parasite == 1 RETURN v) 

    LET frees = count(for x IN 1..100 OUTBOUND v edges_otl_sub
                FILTER x.freeliving == 1 RETURN v)

    UPDATE v WITH { nr_parasites_new: paras,
                    nr_freeliving_new: frees } in nodes_otl_sub
`);