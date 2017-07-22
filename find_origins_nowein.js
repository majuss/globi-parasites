'use strict';

const db = require('arangojs')();
var counter = 0;
var counter2 = 0;

db.query(`  FOR doc IN edges_otl_nowein 
            return DOCUMENT([doc._from, doc._to])`, {}, { ttl: 1000 * 3600 }).then(calculateOrigins); //get all edges



function calculateOrigins(cursor) {
    
    cursor.all().then(docs => {
        for(const doc of docs) {
        // console.log(doc);
            const [doc1,doc2] = doc;
        if (doc1.pi < 0.5 && doc2.pi > 0.5){
            db.query(`UPDATE "${doc1._key}" WITH {  origin_from: 1} in nodes_otl_nowein`);
            db.query(`UPDATE "${doc2._key}" WITH {  origin_to: 1,
                                                    originID: ${counter}} in nodes_otl_nowein`);
            counter++;}
        if (doc1.pi > 0.5 && doc2.pi < 0.5){
            
            db.query(`UPDATE "${doc1._key}" WITH {  loss_from: 1} in nodes_otl_nowein`);
            db.query(`UPDATE "${doc2._key}" WITH {  loss_to: 1,
                                                    lossID: ${counter2}} in nodes_otl_nowein`);
            counter2++;}
        }
        console.log('Finished building origins nowein. origins' + counter + '   ' + counter2);
    })
}
