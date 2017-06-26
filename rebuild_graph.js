'use strict';

const db       = require('arangojs')();
const graph    = db.graph('otl');
graph.drop();
graph.create({
    edgeDefinitions: [
        {
            collection: 'edges_otl',
            from: [
                'nodes_otl'
            ],
            to: [
                'nodes_otl'
            ]
        }
    ]
});