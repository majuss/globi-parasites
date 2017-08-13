'use strict';
const db = require('arangojs')();

db.query(`
let foraminifera = (For node in nodes_otl Filter node.name =="Foraminifera" Return node._key)
UPDATE foraminifera[0] WITH { rank: 'suphylum' } IN nodes_otl
`)

db.query(`
let Ascetosporea = (For node in nodes_otl Filter node.name =="Ascetosporea" Return node._key)
UPDATE Ascetosporea[0] WITH { rank: 'class' } IN nodes_otl
`)