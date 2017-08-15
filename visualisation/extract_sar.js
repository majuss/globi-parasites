'use strict';

const db = require('arangojs')();
const collection = db.collection('extract_sar');
const collectione = db.edgeCollection('extracte_sar')

async function sar(){
    await collection.drop();
    await collectione.drop();
    await collection.create()
    await collectione.create()
    db.query(`
    FOR v,e IN 0..100 OUTBOUND 'nodes_otl/5246039' edges_otl
    INSERT v IN extract_sar
    INSERT {
        _from:concat('extract_sar/', SPLIT(e._from, '/')[1] ),
        _to: concat('extract_sar/', SPLIT(e._to, '/')[1] )
    } INTO extracte_sar OPTIONS { ignoreErrors: true }
    `)
}
sar();