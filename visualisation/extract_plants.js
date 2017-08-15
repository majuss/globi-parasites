'use strict';

const db = require('arangojs')();
const collection = db.collection('extract_plants');
const collectione = db.edgeCollection('extracte_plants')

async function plants(){
    await collection.drop();
    await collectione.drop();
    await collection.create()
    await collectione.create()
    db.query(`
    FOR v,e IN 0..100 OUTBOUND 'nodes_otl/5268475' edges_otl
    INSERT v IN extract_plants
    INSERT {
        _from:concat('extract_plants/', SPLIT(e._from, '/')[1] ),
        _to: concat('extract_plants/', SPLIT(e._to, '/')[1] )
    } INTO extracte_plants OPTIONS { ignoreErrors: true }
    `)
}
plants();