'use strict';
const db = require('arangojs')();

//tag the full tree with origins and losses

db.query(`  FOR doc IN nodes_otl_sub
            FILTER doc.origin_to == 1
            UPDATE doc._key WITH { origin: 1 } IN nodes_otl`);

db.query(`  FOR doc IN nodes_otl_sub
            FILTER doc.loss_to == 1
            UPDATE doc._key WITH { loss: 1 } IN nodes_otl`);

db.query(`  FOR doc IN weinstein
            UPDATE doc._key WITH { originw: 1 } IN nodes_otl`);

db.query(`  FOR doc IN nodes_otl_sub
            FILTER doc.origin_from == 1
            UPDATE doc._key WITH { origin_from: 1 } IN nodes_otl`);

db.query(`  FOR doc IN nodes_otl_sub
            FILTER doc.loss_from == 1
            UPDATE doc._key WITH { loss_from: 1 } IN nodes_otl`);

db.query(`  FOR doc IN nodes_otl_sub
            FILTER doc.nr_sum_leafs_import != null
            UPDATE doc._key WITH { 
                                    nr_leaf_parasites_import: doc.nr_leaf_parasites_import,
                                    nr_leaf_freeliving_import: doc.nr_leaf_freeliving_import,
                                    nr_sum_leafs_import: doc.nr_sum_leafs_import } IN nodes_otl`);