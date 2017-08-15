'use strict';

const db = require('arangojs')();

db.query(`
FOR doc in rank_extract
FILTER doc.freeliving == 1 && doc.freelivingw == 1
UPDATE doc WITH {color: "#44A437"} in rank_extract //dark green
`)

db.query(`
FOR doc in rank_extract
FILTER doc.parasite == 1 && doc.parasitew == 1
UPDATE doc WITH {color: "#B42026"} in rank_extract //dark red
`)

db.query(`
FOR doc in rank_extract
FILTER doc.parasite == 1 && doc.freelivingw == 1
UPDATE doc WITH {color: "#F09846"} in rank_extract //orange
`)

db.query(`
FOR doc in rank_extract
FILTER doc.parasitew == 1 && doc.freeliving == 1
UPDATE doc WITH {color: "#2C68F0"} in rank_extract //blue
`)

//remove text for too small cake slizes of sunburst
db.query(`
FOR doc in rank_extract
FILTER doc.rank == "family" || doc.rank == "order"
UPDATE doc WITH { name: null} in rank_extract
`)


correct_size();

async function correct_size() {
    
    
    let phylla = await db.query(`
    FOR doc in rank_extract
    FILTER doc.rank == "phylum"
    return doc
    `) 
    phylla = await phylla.all();
    //console.log(phylla)
    for(const node of phylla){
        //console.log(id)
        let count = await db.query(`
        RETURN COUNT(
        FOR node IN 1..100 OUTBOUND '${node._id}' rank_extracte
        FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id rank_extracte RETURN v)
        RETURN node)
        `)
        count = await count.all();
        //console.log(count)

        //console.log(count);
        let size = await 1000 / count;
        console.log(size);
        db.query(`
        FOR node IN 1..100 OUTBOUND '${node._id}' rank_extracte
        FILTER 0 == LENGTH(FOR v,e,p IN OUTBOUND node._id rank_extracte RETURN v)
        UPDATE node WITH {size: ${size} } IN rank_extract
        `)
        
    }
}