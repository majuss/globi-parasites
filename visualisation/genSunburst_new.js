'use strict';

const fs = require('fs');
const fastango3 = require('fastango3');
const db = fastango3('http://127.0.0.1:8529');
const bfj = require('bfj');

const convert = () => {
    const db = require('@arangodb').db;

    const tree = {};

    buildTree('rank_extract/691846', tree);

    async function buildTree(nodeId, tree) {
        const node =  db._document(nodeId);

        // tree.size = 1;
        tree.name = node.name;
        tree.children = [];

        const childIds = db._query(`FOR v IN OUTBOUND '${node._id}' rank_extracte RETURN v`).toArray();

        for(const childId of childIds) {
            const obj = {};
            tree.color = childId.color;
            tree.children.push(obj);
            buildTree(childId._id, obj);
        }

        
        if (0 === tree.children.length) {
            tree.size = 1;
            tree.color = node.color;
        }
    }

    return tree; // res[0];
};

db._txn({
    collections: {
        read:['rank_extract']
    }}, convert, (status, headers, body) => {
        body = JSON.parse(body);


        /* bfj.write('tree.json', body.result)
        .then(() => {
            console.log("Finished generating sunburst tree");
          });
 */
        //fs.writeFileSync('treeee.json', JSON.stringify(body.result, false, 2));
        
    });

