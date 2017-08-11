'use strict';
const db = require('arangojs')();

async function counting() {
    let crossCount = await db.query(`
        return count(
        for doc in nodes_otl_sub
        filter doc.parasite == 1 && doc.freeliving == 1
        return doc)`);

        
        crossCount = await crossCount.all();
        db.query(`
        Insert {_key: 'table2', 
            crossie: '${await crossCount}'
        } IN counts
        
        `)
}

counting();