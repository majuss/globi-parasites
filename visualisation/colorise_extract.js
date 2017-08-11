'use strict';

var db = require('arangojs')();

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