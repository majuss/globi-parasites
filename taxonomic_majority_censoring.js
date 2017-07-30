const fastango3 = require('fastango3');
const db = fastango3('http://127.0.0.1:8529');

const leafNodes = [];

const convert = () => {
    const db = require('@arangodb').db;

    const computedIds = new Set();
    const leafIds = db._query(`
        FOR node IN nodes_otl_sub     //look for any node, if hes got an outbound path
        FILTER 0 == length(
        FOR v,e,p IN OUTBOUND node._id edges_otl_sub
        RETURN v)
        RETURN node._id`).toArray();
    
    for (const leafId of leafIds) computedIds.add(leafId);
    console.log(computedIds.size);
    
    while (true) {
        
        if (0 === leafIds.length) break;

        const leafId = leafIds.shift();

        console.log(leafIds.length);

        const parent = db._query(`FOR v,e,p IN INBOUND '${leafId}' edges_otl_sub RETURN v`).toArray()[0];
        if (!parent) continue;

        const childs = db._query(`FOR v,e,p IN OUTBOUND '${parent._id}' edges_otl_sub RETURN v`).toArray();

        if (childs.filter(child => !computedIds.has(child._id)).length) {
            for (const child of childs) {
                if (!computedIds.has(child._id) && -1 === leafIds.indexOf(child._id)) {
                    leafIds.push(child._id);
                }
            }
            leafIds.push(leafId);
            continue;
        }

        // compute child + parent / count

        let val = parent.pi;
        childs.forEach(child => val += child.pi);
        val /= (childs.length + 1);

        db.nodes_otl_sub.update(parent._id, {pi:val});

        computedIds.add(parent._id);
        for (const child of childs) {
            computedIds.add(child._id);
            const idx = leafIds.indexOf(child._id);
            if (-1 !== idx)
                leafIds.splice(idx, 1);
        }
        leafIds.push(parent._id);
    } // while
    
    piPoint5s = db._query(`
        FOR node IN nodes_otl_sub
        FILTER node.pi == 0.5
        RETURN node._id`).toArray();

    for (const piPoint5 of piPoint5s) {
        try {

            const pi = db._query(`
            
            FOR pi IN SLICE(
                    (FOR v IN INBOUND SHORTEST_PATH '${piPoint5}' TO 'nodes_otl_sub/304358' edges_otl_sub
                    RETURN v.pi)
                , 1)
            
                Filter pi != 0.5
                return pi`).toArray()[0];
            if (pi == null) console.log('pi', pi, piPoint5);
        db.nodes_otl_sub.update(piPoint5, {pi:pi});
        } catch(e) {
            console.log('FAIL', e);
        }
    }
    return 'done'; // res[0];
};

db._txn({
    collections: {
        read:['edges_otl_sub', 'nodes_otl_sub'],
        write:['edges_otl_sub', 'nodes_otl_sub'],
    }}, convert, (status, headers, body) => {
        // console.log(status);
        body = JSON.parse(body);
        console.log(body);
        console.log("Finished TMC");
    });