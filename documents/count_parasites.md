# How to generate the number of parasites in GLoBIs databse

For all interactions used to determine which species is freeliving/parasite, look at `documents/interaction_table.md`.

## Number of Databases inside GLoBI's
http://www.globalbioticinteractions.org/references.html

- 305 Data sources
- 2,826,871 interactions
- 184,721 taxa

## Example AQL queries

### Return count of all parasites

Distinct coount concerning TaxonName:
```
return count(
for doc in interaction_tsv
filter doc.interactionTypeName == 'parasiteOf' ||
doc.interactionTypeName == 'ectoParasiteOf'||
doc.interactionTypeName == 'kleptoparasiteOf' ||
doc.interactionTypeName == 'ectoParasitoid' ||
doc.interactionTypeName == 'endoparasiteOf' ||
doc.interactionTypeName == 'parasitoidOf' ||
doc.interactionTypeName == 'endoparasitoidOf'
return distinct doc.sourceTaxonName
)
```

### Return count of eucaryotic parasites (in build OTT tree)
```
return count(
FOR v,e IN 1..100 outbound 'otl_parasites_nodes/304358' otl_parasites_edges
  FILTER v.parasite == 1
RETURN v)
```
Note that the OTT-ID 304358 represents the Eukaryota-node.

# Tables

Note that this table should get visualized in a better way later on (tree with number).


taxonomic group | count of parasites
---|---
Eukaryota | 11.030
- Fungi | 2.385
- Metazoa | 8.207
- Archaeplastida | 126
- Chloroplastida | 125




## Interactions_tsv
counted Term | count
---|---
Parasites nondistinct | 159753
Parasites distinct TaxonName | 18266
Freeliving nondistinct (source) | 1402317
Freeliving Distinct (ssource) | 36225
Freeliving nondistinct (target) | 180556
Freeliving Distinct (target) | 19654