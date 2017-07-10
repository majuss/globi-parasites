'use strict';

const fastango3 = require('fastango3');
const db = fastango3('http://127.0.0.1:8529');

// all freeliving = 0
    
function writepis(){

    const db = require('@arangodb').db;



db._query(`
for doc in otl_parasites_nodes
filter doc.freeliving == 1
update doc with {pi: 0} in otl_parasites_nodes`);

// all parasites = 1

db._query(`
for doc in otl_parasites_nodes
filter doc.parasite == 1
update doc with {pi: 1} in otl_parasites_nodes`);

// all freeliving != sub(species) + genus = 0.45

db._query(`
for doc in otl_parasites_nodes
filter doc.rank != 'species' && doc.rank != 'genus' && doc.rank != 'subspecies' && doc.freeliving == 1
update doc WITH { pi: 0.45 } in otl_parasites_nodes`);

// all parasites != sub(species) + genus = 0.55

db._query(`
for doc in otl_parasites_nodes
filter doc.rank != 'species' && doc.rank != 'genus' && doc.rank != 'subspecies' && doc.parasite == 1
update doc WITH { pi: 0.55 } in otl_parasites_nodes`);

// all fillings in between = 0.5

db._query(`
for doc in otl_parasites_nodes
filter doc.parasite == 0 || doc.freeliving == 0
update doc with {pi: 0.5} in otl_parasites_nodes`);
}


db._txn({

 collections: {
        read:['otl_parasites_nodes'],
        write:['otl_parasites_nodes'],
    }}, writepis, (status, headers, body) => {
        // console.log(status);
        body = JSON.parse(body);
        console.log(body);
});