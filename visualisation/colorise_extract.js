'use strict';

var db = require('arangojs')();

db.query(`
FOR doc in rank_extract
FILTER doc.freeliving == 1 && doc.freelivingw == 1
UPDATE doc WITH {color: "#237222"} in rank_extract //dark green
`)

db.query(`
FOR doc in rank_extract
FILTER doc.freeliving == 1 && doc.freelivingw == null
UPDATE doc WITH {color: "#23CF20"} in rank_extract //light green
`)

db.query(`
FOR doc in rank_extract
FILTER doc.freelivingw == 1 && doc.freeliving == null
UPDATE doc WITH {color: "#AFE5AE"} in rank_extract //very light green
`)

db.query(`
FOR doc in rank_extract
FILTER doc.parasite == 1 && doc.parasitew == 1
UPDATE doc WITH {color: "#BA3727"} in rank_extract //dark red
`)

db.query(`
FOR doc in rank_extract
FILTER doc.parasite == 1 && doc.parasitew == null
UPDATE doc WITH {color: "#FF5F4C"} in rank_extract //light red
`)

db.query(`
FOR doc in rank_extract
FILTER doc.parasite == 1 && doc.parasitew == null
UPDATE doc WITH {color: "#F5AFA7"} in rank_extract //pastel red
`)