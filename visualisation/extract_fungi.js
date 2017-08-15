'use strict';

const db = require('arangojs')();
const collection = db.collection('extract_fungi');
const collectione = db.edgeCollection('extracte_fungi')

async function fungi(){
    await collection.drop();
    await collection.create()
    await collectione.drop();
    await collectione.create()
    db.query(`
    FOR v,e IN 0..100 OUTBOUND 'nodes_otl/352914' edges_otl
    INSERT v IN extract_fungi
    INSERT {
        _from:concat('extract_fungi/', SPLIT(e._from, '/')[1] ),
        _to: concat('extract_fungi/', SPLIT(e._to, '/')[1] )
    } INTO extracte_fungi OPTIONS { ignoreErrors: true }
    `)
}
fungi();