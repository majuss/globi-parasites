#!/bin/bash
#
# This is just a quick approach to count the considered parasitic interaction in GLoBIs database 
egrep 'parasiteOf|ectoParasiteOf|kleptoparasiteOf|ectoParasitoid|endoparasiteOf|parasitoidOf|endoparasitoidOf' ../data/interactions.tsv | wc -l


# grepping is way too slow!