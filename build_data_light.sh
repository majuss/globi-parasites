#!/bin/bash

# Build system for everything this will take about 50 minutes (20 cores ivy bridge, 64 GB RAM)
echo "Logifle written to: build_data.log"
exec 3>&1 1>>build_data.log 2>&1

echo $(date)
start=$(date +%s)
npm i arangojs fastango3

echo "$(tput setaf 1)$(tput setab 7)------- Tree imported (5/9) --------$(tput sgr 0)" 1>&3
arangosh --server.authentication false --javascript.execute-string 'db._drop("otl_parasites_nodes");' 
arangosh --server.authentication false --javascript.execute-string 'db._drop("otl_parasites_edges");' 
arangosh --server.authentication false --javascript.execute-string 'db._createEdgeCollection("otl_parasites_edges");' 
arangosh --server.authentication false --javascript.execute-string 'db._create("otl_parasites_nodes");' 
node build_freeliving_source.js &
node build_freeliving_target.js &
node build_parasites-collection.js &
wait
arangosh --server.authentication false --javascript.execute-string 'db._drop("otl_parasites_nodes_nowein");' 
arangosh --server.authentication false --javascript.execute-string 'db._drop("otl_parasites_edges_nowein");' 
arangosh --server.authentication false --javascript.execute-string 'db._createEdgeCollection("otl_parasites_edges_nowein");' 
arangosh --server.authentication false --javascript.execute-string 'db._create("otl_parasites_nodes_nowein");' 
wait
arangosh --server.authentication false --javascript.execute-string 'db._query("FOR doc in otl_parasites_nodes INSERT doc IN otl_parasites_nodes_nowein");' 
arangosh --server.authentication false --javascript.execute-string 'db._query("FOR doc in otl_parasites_edges INSERT doc IN otl_parasites_edges_nowein");' 
echo "$(tput setaf 1)$(tput setab 7)-------- Building parasite/freeliving collections done (6/9) --------$(tput sgr 0)" 1>&3
arangosh --server.authentication false --javascript.execute-string 'db._drop("weinstein");' 
arangosh --server.authentication false --javascript.execute-string 'db._drop("weinstein_noott");' 
arangoimp --file weinstein/weinstein.tsv --type tsv --collection weinstein --create-collection true --server.authentication false 
arangoimp --file weinstein/weinstein_noOTT.tsv --type tsv --collection weinstein_noott --create-collection true --server.authentication false 
node weinstein/import_weinstein.js 
node weinstein/import_weinstein_noott.js 
echo "$(tput setaf 1)$(tput setab 7)-------- Done importing weinstein2016 (7/9) --------$(tput sgr 0)" 1>&3
node counting/generate_counts.js 
node counting/phylla_count.js
nohit=$(wc -l weinstein/weinstein_nohit.tsv | awk '{print $1}')
arangosh --server.authentication false --javascript.execute-string "db._update('counts/table', {'no Hits for Weinstein': $nohit})"
echo "$(tput setaf 1)$(tput setab 7)-------- Done generating counts (8/9) --------$(tput sgr 0)" 1>&3
node write_pis.js
node taxonomic_majority_censoring.js
node find_origins.js
node counting/tag_origin_counts.js
node write_pis_nowein.js
node taxonomic_majority_censoring_nowein.js
node find_origins_nowein.js
node counting/tag_origin_counts.js
echo "$(tput setaf 1)$(tput setab 7)-------- Done generating PIs, calculating origins and tag origin counts (9/9) --------$(tput sgr 0)" 1>&3
end=$(date +%s)
runtime=$(((end-start)/60))
echo "$runtime minutes" 
echo "$(tput setaf 1)$(tput setab 7)This run took $runtime minutes$(tput sgr 0)" 1>&3