'use strict';

const fastango3 = require('fastango3');
const db = fastango3('http://127.0.0.1:8529');

const convert = () => {
    const db = require('@arangodb').db;
    db._query(`
    UPDATE "304358" with {freeliving:1, freelivingw:1} in nodes_otl
    `)
    const childsToProcess = ['nodes_otl/304358'];

    while (childsToProcess.length) {

        const parent = db._document(childsToProcess.shift());
        const childs = db._query(`FOR v IN OUTBOUND '${parent._id}' edges_otl RETURN v`).toArray();

        for (const child of childs) {
            const upDoc = {};
            if (child.origin == 1 || parent.parasite == 1 && child.loss == null) upDoc.parasite = 1;
            else if (child.loss == 1 || parent.freeliving == 1) upDoc.freeliving = 1;

            db._update(child._id, upDoc);
            childsToProcess.push(child._id);
        }
    }
    return 'done'; // res[0];
};

db._txn({
    collections: {
        read:['nodes_otl'],
        write:['nodes_otl'],
    }}, convert, (status, headers, body) => {
        // console.log(status);
        body = JSON.parse(body);
        console.log(body);
        console.log("Finished tagging parasites/freeliving on full tree");
    });