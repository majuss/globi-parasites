#!/bin/bash

# Build system for the required data (OTT taxonomy.tsv and GLoBI interactions.tsv)

npm i arangojs fastango3
mkdir data
cd data
wget https://s3.amazonaws.com/globi/snapshot/target/data/tsv/interactions.tsv.gz
gunzip interactions.tsv.gz
wget http://files.opentreeoflife.org/ott/ott3.0/ott3.0.tgz
tar -xvf ott3.0.tgz
rm ott3.0.tgz
mv ott/taxonomy.tsv .
rm -rf ott
arangoimp --file interactions.tsv --type tsv --collection interaction_tsv --create-collection true
cd ..
node tagging/tag_interactionstsv_freelivings.js
node tagging/tag_interactionstsv_paras.js
node tagging/tag_interactionstsv_freelivingt.js
node build_freeliving_source.js
node build_freeliving_target.js
node build_parasites-collection.js
bash weinstein/build_weinstein-tsv.sh weinstein/weinstein_extract.md data/taxonomy.tsv
node weinstein/import_weinstein.js
node weinstein/import_weinstein_noott.js