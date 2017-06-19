const fastango3 = require('fastango3');
const db = fastango3('http://127.0.0.1:8529');

        // crosshits are updated with parasite: 1


const leafNodes = [];

const convert = () => {
    const db = require('@arangodb').db;

    const leafs = db._query(`for node in otl_parasites_nodes
        filter 0 == length(
            for v,e,p in outbound node._id otl_parasites_edges
            return v
        )
        return node._id`).toArray();

    while(true) {
        if (0 === leafs.length) break;
        const parent = db._query(`FOR v,e,p IN INBOUND '${leafs[0]}' otl_parasites_edges RETURN v`).toArray()[0];
        if (!parent) {leafs.shift(); continue; }
        leafs.push(parent._id);

        const childs = db._query(`FOR v,e,p IN OUTBOUND '${parent._id}' otl_parasites_edges RETURN v`).toArray();

        if (childs.filter(child => child.freeliving !== 1 && child.parasite !== 1).length)
            continue;

        if (parent.freeliving !== 1 && parent.parasite !== 1) {
            const parasites = childs.filter(child => child.parasite == 1).length;
            const ratio = parasites / childs.length;
            
            if (0.5 <= ratio) {
                db.otl_parasites_nodes.update(parent._id, {parasite:1, freeliving:0});
            } else {
                db.otl_parasites_nodes.update(parent._id, {parasite:0, freeliving:1});
            }
        }

        for(const child of childs) {
            const idx = leafs.indexOf(child._id);
            if (-1 === idx) continue;
            leafs.splice(idx, 1);
        }
    }

    return 'done'; // res[0];
};


db._txn({
    collections: {
        read:['otl_parasites_edges', 'otl_parasites_nodes'],
        write:['otl_parasites_edges', 'otl_parasites_nodes'],
    }}, convert, (status, headers, body) => {
        // console.log(status);

        body = JSON.parse(body);

        console.log(body);
    });
