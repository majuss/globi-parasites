'use strict';

const db                = require('arangojs')();
const collectione       = db.edgeCollection('edges_otl_sub')
const collectionebak    = db.edgeCollection('edges_otl_sub_bak')
const collection        = db.collection('nodes_otl_sub')
const collectionbak     = db.collection('nodes_otl_bak_sub')
const collection2       = db.collection('nodes_otl');
const collectionbak2    = db.collection('nodes_otl_bak');
const collectione2      = db.edgeCollection('edges_otl')
const collectionebak2   = db.edgeCollection('edges_otl_bak')

async function createcol(){
    try{await collectione.drop();}catch(e){};
    try{await collectionebak.drop();}catch(e){};
    try{await collection.drop();}catch(e){};
    try{await collectionbak.drop();}catch(e){};
    try{await collection2.drop();}catch(e){};
    try{await collectionbak2.drop();}catch(e){};
    try{await collectione2.drop();}catch(e){};
    try{await collectionebak2.drop();}catch(e){};
    await collectione2.create()
    await collectionebak2.create()
    await collection2.create()
    await collectionbak2.create()
    await collectione.create()
    await collectionebak.create()
    await collection.create()
    await collectionbak.create()
}

createcol();