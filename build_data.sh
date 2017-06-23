#!/bin/bash

# Build system for everything this will take about 90 minutes (8 cores ivy bridge, 64 GB RAM)

echo "Logifle written to: build_data.log"
echo $(date) &> build_data.log
start=$(date +%s)
npm i arangojs fastango3 &> build_data.log
echo "$(tput setaf 1)$(tput setab 7)------- Node packages installed (1/8) --------$(tput sgr 0)"
rm -rf data &> build_data.log
mkdir data &> build_data.log
cd data
wget https://s3.amazonaws.com/globi/snapshot/target/data/tsv/interactions.tsv.gz &> build_data.log
gunzip interactions.tsv.gz &> build_data.log
wget http://files.opentreeoflife.org/ott/ott3.0/ott3.0.tgz &> build_data.log
tar -xvf ott3.0.tgz &> build_data.log
rm ott3.0.tgz &> build_data.log
mv ott/taxonomy.tsv . &> build_data.log
rm -rf ott &> build_data.log
echo "$(tput setaf 1)$(tput setab 7)------- Tree and Interaction-data downloaded (2/8) --------$(tput sgr 0)"
arangosh --server.authentication false --javascript.execute-string 'db._drop("interaction_tsv");' >> build_data.log
arangoimp --file interactions.tsv --type tsv --collection interaction_tsv --create-collection true --server.authentication false >> build_data.log
wait
echo "$(tput setaf 1)$(tput setab 7)------- Interactions imported (3/8) --------$(tput sgr 0)"
cd ..
bash weinstein/build_weinstein-tsv.sh weinstein/weinstein_extract.md data/taxonomy.tsv  >> build_data.log &
node tagging/tag_interactionstsv_freelivings.js  >> build_data.log &
node tagging/tag_interactionstsv_paras.js  >> build_data.log &
node tagging/tag_interactionstsv_freelivingt.js  >> build_data.log &
wait
echo "$(tput setaf 1)$(tput setab 7)------- Interaction entries tagged Weinstein2016 data created (4/8) --------$(tput sgr 0)"
arangosh --server.authentication false --javascript.execute-string 'db._drop("nodes_otl");'  >> build_data.log
arangosh --server.authentication false --javascript.execute-string 'db._drop("edges_otl");'  >> build_data.log
arangosh --server.authentication false --javascript.execute-string 'db._createEdgeCollection("edges_otl");'  >> build_data.log
arangosh --server.authentication false --javascript.execute-string 'db._create("nodes_otl");'  >> build_data.log
node edgesimport_otl.js >> build_data.log &
node nodesimport_otl.js >> build_data.log &
wait
echo "$(tput setaf 1)$(tput setab 7)------- Tree imported (5/8) --------$(tput sgr 0)"
node build_freeliving_source.js >> build_data.log &
node build_freeliving_target.js >> build_data.log &
node build_parasites-collection.js >> build_data.log &
wait
echo "$(tput setaf 1)$(tput setab 7)-------- Building parasite/freeliving collections done (6/8) --------$(tput sgr 0)"
arangosh --server.authentication false --javascript.execute-string 'db._drop("weinstein");' >> build_data.log
arangosh --server.authentication false --javascript.execute-string 'db._drop("weinstein_noott");' >> build_data.log
arangoimp --file weinstein/weinstein.tsv --type tsv --collection weinstein --create-collection true --server.authentication false >> build_data.log
arangoimp --file weinstein/weinstein_noOTT.tsv --type tsv --collection weinstein_noott --create-collection true --server.authentication false >> build_data.log
node weinstein/import_weinstein.js >> build_data.log
node weinstein/import_weinstein_noott.js >> build_data.log
echo "$(tput setaf 1)$(tput setab 7)-------- Done importing weinstein2016 (7/8) --------$(tput sgr 0)"
node documents/generate_counts.js >> build_data.log
node documents/phylla_count.js >> build_data.log
echo "$(tput setaf 1)$(tput setab 7)-------- Done generating counts (8/8) --------$(tput sgr 0)"
end=$(date +%s)
runtime=$(((end-start)/60))
echo "$runtime minutes" >> build_data.log
echo "$(tput setaf 1)$(tput setab 7)This run took $runtime minutes$(tput sgr 0)"

> allout.txt 2>&1 