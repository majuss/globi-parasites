'use strict';

const db = require('arangojs')();


async function pathcalc() {
    
    let leafs = await db.query(`
        FOR node IN otl_parasites_nodes
        limit 10
        FILTER 0 == length(
        FOR v,e,p IN OUTBOUND node._id otl_parasites_edges
        RETURN v)
        RETURN node._id
        `);
    console.log(leafs._result);
}
pathcalc();
