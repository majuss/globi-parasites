#!/bin/bash

# Build system for everything this will take about 90 minutes (8 cores ivy bridge, 64 GB RAM)

start=`date +%M`
npm i arangojs fastango3
echo "------- Node packages installed (1/8) --------"
rm -rf data
mkdir data
cd data
wget https://s3.amazonaws.com/globi/snapshot/target/data/tsv/interactions.tsv.gz
gunzip interactions.tsv.gz
wget http://files.opentreeoflife.org/ott/ott3.0/ott3.0.tgz
tar -xvf ott3.0.tgz
rm ott3.0.tgz
mv ott/taxonomy.tsv .
rm -rf ott
echo "------- Tree and Interaction-data downloaded (2/8) --------"
arangosh --server.authentication false --javascript.execute-string 'db._drop("interaction_tsv");'
arangoimp --file interactions.tsv --type tsv --collection interaction_tsv --create-collection true --server.authentication false
echo "------- Interactions imported (3/8) --------"
cd ..
bash weinstein/build_weinstein-tsv.sh weinstein/weinstein_extract.md data/taxonomy.tsv &
node tagging/tag_interactionstsv_freelivings.js &
node tagging/tag_interactionstsv_paras.js &
node tagging/tag_interactionstsv_freelivingt.js &
wait
echo "------- Interaction entries tagged Weinstein2016 data created (4/8) --------"
arangosh --server.authentication false --javascript.execute-string 'db._drop("nodes_otl");'
arangosh --server.authentication false --javascript.execute-string 'db._drop("edges_otl");'
arangosh --server.authentication false --javascript.execute-string 'db._createEdgeCollection("edges_otl");'
arangosh --server.authentication false --javascript.execute-string 'db._create("nodes_otl");'
node edgesimport_otl.js &
node nodesimport_otl.js &
wait
echo "------- Tree imported (5/7) --------"
node build_freeliving_source.js &
node build_freeliving_target.js &
node build_parasites-collection.js &
wait
echo "-------- Building parasite/freeliving collections done (6/8) --------"
arangosh --server.authentication false --javascript.execute-string 'db._drop("weinstein.tsv");'
arangosh --server.authentication false --javascript.execute-string 'db._drop("weinstein_noOTT.tsv");'
arangoimp --file weinstein/weinstein.tsv --type tsv --collection weinstein --create-collection true --server.authentication false
arangoimp --file weinstein/weinstein_noOTT.tsv --type tsv --collection weinstein_noott --create-collection true --server.authentication false
node weinstein/import_weinstein.js
node weinstein/import_weinstein_noott.js
echo "-------- Done importing weinstein2016 (7/8) --------"
node documents/generate_counts.js
node phylla_count.js
echo "-------- Done generating counts (8/8) --------"
start=`date +%M`
runtime=$((end-start))
echo "This run took '$runtime' minutes"