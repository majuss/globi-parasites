connect to the VM:
```
ssh h -L 127.0.0.1:8529:127.0.0.1:8529 -p 15350 -q
```
---
1. Setup arangodb and node_7.9 and install needed packages in package.json

2. Download globi's .tsv dump:
```
wget https://s3.amazonaws.com/globi/snapshot/target/data/tsv/interactions.tsv.gz
```

Import the extraced tsv-dump with:
```
arangoimp --file interactions.tsv --type tsv --collection interaction_tsv --create-collection true
```

3. **import open tree of life dump**

```
http://files.opentreeoflife.org/ott/ott3.0/ott3.0.tgz
```
Extract it and create the collections for the edges (edges_otl) and nodes (nodes_otl)
The run the importer with node_7.9!
```
node nodesimport_otl.js
node edgesimport_otl.js
```

4. Now we should repair the rank-path inside of the globi entries and export them as edge-collection. `rebuild_rankpath_clean.js` just rebuild a simpleRank/Path and imports the rank into `nodes_interaction` and `edges_interaction`.

**Currently working on:**

- save shortest path from every parasite/free living to new collection; key which determines if parasite
- find out which interactionTypeName determines if a species is free living or parasitic
- export free living or parasite state


**Future work:**

- draw the graph database with sigma.js(?)
- look at the opentree for phylogeny `https://tree.opentreeoflife.org/opentree/argus/opentree9.1@ott93302`