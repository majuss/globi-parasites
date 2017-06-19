# GLoBIs parasites

Here is the workflow to reproduce the current findings:

**1. connect to the VM thats running arangoDB:**
```
ssh h -L 127.0.0.1:8529:127.0.0.1:8529 -p 15350 -q
```
**2. Setup arangoDB and node.v8+ and install needed packages in package.json**

**3. Run the data-building script:**
```
bash build_data.sh
```
**4. Import open tree of life dump**
```
node nodesimport_otl.js
node edgesimport_otl.js
```
**4. Now we create 2 subsetted collections containing all parasites (according to interactionTypeName) with:**
```
node build_parasites-collection.js
node build_freeliving_source.js
node build_freeliving_target.js
```
**5. Create Weinstein.2016 extract by selecting all *bold* entries from her supp. data and write it to a file**

**6. Build and import Weinstein.2016 data:**
```
bash build_weinstein-tsv.sh weinstein_extract.tsv data/taxonomy.tsv
node import_weinstein_noott.js
node import_weinstein.js
```
**7. Tag interaction_tsv collection**
```
node tag_interactiontsv_paras.js
```
**8. To count stuff just execute the js code in /documents**

# ToDo's

**Currently working on:**
- counts: array with all animal phylla, loop trough them update doc.

**In the long run:**
- use simple parsimony algorithm to determine how often parasitism occurred in the evolution (of Eukaryota?)
- find out which interactionTypeName determines if a species is free living or parasitic (in documents/interaction_table.md)

**May?**
- write master thesis as git-book? Create new book and add basic ToC and points what to include

**Future work:** (not important)
- draw the graph database with sigma.js(?)
- look at the opentree for phylogeny `https://tree.opentreeoflife.org/opentree/argus/opentree9.1@ott93302`


### Notes

Link to current thesis notes: https://www.icloud.com/pages/0U8KA609rmdiKQphfj_W2TaFQ#ma

If you get an error that says that node is out of memory, run it with more: `--max_old_space_size=16384`