'use strict';

var db = require('arangojs')();


db.query(`
FOR v,e IN 0..100 OUTBOUND 'nodes_otl/352914' edges_otl
INSERT v IN extract_fungi
INSERT {
    _from:concat('nodes_otl_sub/', SPLIT(doc._from, '/')[1] ),
    _from: "extract_fungi/v._key",
    _to: concat('extract_fungi/', v._key)
    } INTO extracte_fungi OPTIONS { ignoreErrors: true }
`)
