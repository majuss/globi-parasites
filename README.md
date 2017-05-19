connect to the VM:
```
ssh h -L 127.0.0.1:8529:127.0.0.1:8529 -p 15350 -q
```


1. Setup arangodb and node8 and install needed packages in package.json

2. Download globi's .tsv dump:
```
wget https://s3.amazonaws.com/globi/snapshot/target/data/tsv/interactions.tsv.gz
```

Import the extraced tsv-dump with:
```
arangoimp --file interactions.tsv --type tsv --collection interaction_tsv --create-collection true
```

3. Download NCBI taxdump

```
ftp://ftp.ncbi.nlm.nih.gov/pub/taxonomy/taxdmp.zip
```
Extract it and create the collections for the edges (nodes.dmp) and nodes (names.dmp)
The run the importer with node8!
```
node nodesimport_ncbi.js
node namesimport_ncbi.js
```

4. Now we should repair the rank-path inside of the globi entries and export them as edge-collection. `rebuild_rankpath_clean.js` just rebuild a simpleRank/Path and imports the rank into `nodes_interaction` and `edges_interaction`.

Currently working on:

- expanded rebuild: if rankpath in GLOBI is no good, look for good path in ncbi imported db. If there is also no good path call the WORMS api.


Future work:

- draw the graph database with sigma.js(?)