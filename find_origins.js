'use strict';

const db = require('arangojs')();
var counter = 0;
var counter2 = 0;

db.query(`  FOR doc IN otl_parasites_edges 
            return DOCUMENT([doc._from, doc._to])`, {}, { ttl: 1000 * 3600 }).then(calculateOrigins); //get all edges



function calculateOrigins(cursor) {
    
    cursor.all().then(docs => {
        for(const doc of docs) {
        // console.log(doc);
            const [doc1,doc2] = doc;
        if (doc1.pi < 0.5 && doc2.pi > 0.5){
            db.query(`UPDATE "${doc1._key}" WITH {  origin1: 1} in otl_parasites_nodes`);
            db.query(`UPDATE "${doc2._key}" WITH {  origin2: 1,
                                                    originID: ${counter}} in otl_parasites_nodes`);
            counter++;}
        if (doc1.pi > 0.5 && doc2.pi < 0.5){
            
            db.query(`UPDATE "${doc1._key}" WITH {  loss1: 1} in otl_parasites_nodes`);
            db.query(`UPDATE "${doc2._key}" WITH {  loss2: 1,
                                                    lossID: ${counter2}} in otl_parasites_nodes`);
            counter2++;}
        }
        console.log('Finished building origins. origins' + counter + '   ' + counter2);
    })
}
