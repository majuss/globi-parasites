# How to generate the number of parasites in GLoBIs databse

Further counting will be automated by: `generate_counts.js`.
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

### Return number of crosshits

```
return count(
for doc in otl_parasites_nodes
filter doc.parasite == 1 && doc.freeliving == 1
return doc
)
```
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


## Get massive Table for Metazoa

//FOR v,e in 1..100 OUTBOUND 'nodes_otl/691846' edges_otl
//filter v.rank == "phylum" || v.name == "Sipucula"
//SORT v.name asc
//RETURN { name: v.name,
//origins: v.nr_origins_from,
//weinstein_origins: v.nr_originw_from,
//losses: v.nr_losses_from,
//leafs_parasites: v.nr_leaf_parasites,
//leafs_parasites_weinstein: v.nr_leaf_parasites_weinstein,
//leafs_freeliving: v.nr_leaf_freeliving,
//leafs_freeliving_weinstein: v.nr_leaf_freeliving_weinstein,
//to_origins: v.nr_origins_to,
//to_origins_wein: v.nr_origins_toweinstein,
//cross_count_paraleafs: v.nr_cross_paras_leafs,
//cross_count_freeleafs: v.nr_cross_free_leafs
//}

## Get table to look at correlation between input data and nr of origins

FOR doc,e in 1..100 OUTBOUND 'nodes_otl_sub/691846' edges_otl_sub
FILTER doc.rank == "phylum"
SORT doc.name asc
RETURN {
name: doc.name,
nr_of_parasites: doc.nr_parasites,
nr_leaf_parasites: doc.nr_leaf_parasites,
nr_freeliving: doc.nr_freeliving,
nr_sum_leafs: doc.sum_leafs,
nr_from_origins: doc.nr_from_origins
}

