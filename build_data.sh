#!/bin/bash

# Build system for everything this will take about 50 minutes (20 cores ivy bridge, 64 GB RAM)
echo "Logifle written to: build_data.log"
exec 3>&1 1>>build_data.log 2>&1

echo $(date)
start=$(date +%s)
npm i arangojs fastango3
echo "$(tput setaf 1)$(tput setab 7)------- Node packages installed (1/8) --------$(tput sgr 0)" 1>&3
rm -rf data
mkdir data
cd data
wget https://s3.amazonaws.com/globi/snapshot/target/data/tsv/interactions.tsv.gz -nv
gunzip interactions.tsv.gz
wget http://files.opentreeoflife.org/ott/ott3.0/ott3.0.tgz -nv
tar -xf ott3.0.tgz 
rm ott3.0.tgz 
mv ott/taxonomy.tsv . 
rm -rf ott 
echo "$(tput setaf 1)$(tput setab 7)------- Tree and Interaction-data downloaded (2/8) --------$(tput sgr 0)" 1>&3
arangosh --server.authentication false --javascript.execute-string 'db._drop("interaction_tsv");' 
arangoimp --file interactions.tsv --type tsv --collection interaction_tsv --create-collection true --server.authentication false
wait
echo "$(tput setaf 1)$(tput setab 7)------- Interactions imported (3/8) --------$(tput sgr 0)" 1>&3
cd ..
bash weinstein/build_weinstein-tsv.sh weinstein/weinstein_extract.md data/taxonomy.tsv &
node tagging/tag_interactionstsv_freelivings.js &
node tagging/tag_interactionstsv_paras.js &
node tagging/tag_interactionstsv_freelivingt.js &
wait
echo "$(tput setaf 1)$(tput setab 7)------- Interaction entries tagged Weinstein2016 data created (4/8) --------$(tput sgr 0)" 1>&3
arangosh --server.authentication false --javascript.execute-string 'db._drop("nodes_otl");' 
arangosh --server.authentication false --javascript.execute-string 'db._drop("edges_otl");' 
arangosh --server.authentication false --javascript.execute-string 'db._createEdgeCollection("edges_otl");' 
arangosh --server.authentication false --javascript.execute-string 'db._create("nodes_otl");' 
node edgesimport_otl.js &
node nodesimport_otl.js &
wait
node rebuild_graph.js
wait
echo "$(tput setaf 1)$(tput setab 7)------- Tree imported (5/8) --------$(tput sgr 0)" 1>&3
arangosh --server.authentication false --javascript.execute-string 'db._drop("otl_parasites_nodes");' 
arangosh --server.authentication false --javascript.execute-string 'db._drop("otl_parasites_edges");' 
arangosh --server.authentication false --javascript.execute-string 'db._createEdgeCollection("otl_parasites_edges");' 
arangosh --server.authentication false --javascript.execute-string 'db._create("otl_parasites_nodes");' 
node build_freeliving_source.js &
node build_freeliving_target.js &
node build_parasites-collection.js &
wait
echo "$(tput setaf 1)$(tput setab 7)-------- Building parasite/freeliving collections done (6/8) --------$(tput sgr 0)" 1>&3
arangosh --server.authentication false --javascript.execute-string 'db._drop("weinstein");' 
arangosh --server.authentication false --javascript.execute-string 'db._drop("weinstein_noott");' 
arangoimp --file weinstein/weinstein.tsv --type tsv --collection weinstein --create-collection true --server.authentication false 
arangoimp --file weinstein/weinstein_noOTT.tsv --type tsv --collection weinstein_noott --create-collection true --server.authentication false 
node weinstein/import_weinstein.js 
node weinstein/import_weinstein_noott.js 
echo "$(tput setaf 1)$(tput setab 7)-------- Done importing weinstein2016 (7/8) --------$(tput sgr 0)" 1>&3
node counting/generate_counts.js 
node counting/phylla_count_parasites.js
node counting/phylla_count_freeliving.js
nohit=$(wc -l weinstein/weinstein_nohit.tsv | awk '{print $1}')
arangosh --server.authentication false --javascript.execute-string "db._update('counts/table', {'no Hits for Weinstein': $nohit})"
echo "$(tput setaf 1)$(tput setab 7)-------- Done generating counts (8/8) --------$(tput sgr 0)" 1>&3
end=$(date +%s)
runtime=$(((end-start)/60))
echo "$runtime minutes" 
echo "$(tput setaf 1)$(tput setab 7)This run took $runtime minutes$(tput sgr 0)" 1>&3