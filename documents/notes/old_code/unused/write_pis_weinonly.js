'use strict';

const fastango3 = require('fastango3');
const db = fastango3('http://127.0.0.1:8529');

// all freeliving = 0
    
function writepis(){

    const db = require('@arangodb').db;



db._query(`
for doc in nodes_otl_weinonly
filter doc.freeliving == 1
update doc with {pi: 0} in nodes_otl_weinonly`);

// all parasites = 1

db._query(`
for doc in nodes_otl_weinonly
filter doc.parasite == 1
update doc with {pi: 1} in nodes_otl_weinonly`);

// all freeliving != sub(species) + genus = 0.45

db._query(`
for doc in nodes_otl_weinonly
filter doc.rank != 'species' && doc.rank != 'genus' && doc.rank != 'subspecies' && doc.rank != 'forma' && doc.rank != 'species subgroup' && doc.rank != 'species group' && doc.freeliving == 1
update doc WITH { pi: 0.45 } in nodes_otl_weinonly`);

// all parasites != sub(species) + genus = 0.55

db._query(`
for doc in nodes_otl_weinonly
filter doc.rank != 'species' && doc.rank != 'genus' && doc.rank != 'subspecies' && doc.rank != 'forma' && doc.rank != 'species subgroup' && doc.rank != 'species group' && doc.parasite == 1
update doc WITH { pi: 0.55 } in nodes_otl_weinonly`);

// all fillings in between = 0.5

db._query(`
for doc in nodes_otl_weinonly
filter doc.parasite == 0 || doc.freeliving == 0
update doc with {pi: 0.5} in nodes_otl_weinonly`);

//assign high ranks freeliving

db._query(`
FOR doc IN nodes_otl_weinonly
FILTER doc.rank == 'phylum' && doc.rank == 'subkingdom' && doc.rank == 'kingdom' && doc.rank == 'domain' && doc.rank == 'infrakingdom' && doc.rank == 'superphylum' && doc.rank == 'infraphylum' && doc.rank == 'subphylum'
UPDATE doc WITH {pi: 0} IN nodes_otl_weinonly`);
}

db._txn({

 collections: {
        read:['nodes_otl_weinonly'],
        write:['nodes_otl_weinonly'],
    }}, writepis, (status, headers, body) => {
        // console.log(status);
        body = JSON.parse(body);
        console.log(body);
        console.log("Finished write PIs weinonly");
});