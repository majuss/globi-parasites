'use strict';
const db = require('arangojs')();
const fs = require('fs');
const jsonexport = require('jsonexport');

async function counting(){
let output = [];
//metazoa 691846

let phylla = await db.query(`
FOR doc IN 1..100 OUTBOUND 'nodes_otl/304358' edges_otl
FILTER doc.rank == "phylum"
RETURN doc
`)
phylla = await phylla.all();

    for(const node of phylla){
    //console.log(node.name)
    let result = await db.query(`
    FOR v IN INBOUND SHORTEST_PATH '${node._id}' TO 'nodes_otl/304358' edges_otl
    FILTER v.name != '${node.name}' && v.rank == "phylum"
    RETURN v
    `)
    result = await result.all();
    //result = JSON.stringify(result, false, 2)
    try{

    output.push('"Phylum: ' + result[0].name + ' is before: ' + node.name + '"')

    //console.log("Phylum:", result[0].name, 'is before:', node.name);
    
    }catch (err) {
        //console.log("no phylum under");
    }
    }
    //console.log(output);
//    console.log(output)
    jsonexport(output,function(err, csv){
        if(err) return console.log(err);
        fs.writeFileSync("analysis/generated_tables/phylum_under_phylum.csv", csv);
        //console.log(output);
       
    });  


}
counting();