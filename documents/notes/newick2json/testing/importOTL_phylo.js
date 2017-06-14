var fs = require("fs");
var parser = require("biojs-io-newick");
var Newick = require('newick');

var data = fs.readFileSync("labelled_supertree.tre").toString();

//console.log(global_data);

//console.log(global_data);



var data2 = Newick.parse(data);

console.log(JSON.stringify(data2, false, 12));

//console.log(JSON.stringify(parser.parse_newick(global_data)), false, 6);


//console.log(parser.parse_newick(data));



