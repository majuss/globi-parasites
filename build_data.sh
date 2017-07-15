#!/bin/bash

# Build system for everything this will take about 90 minutes (20 cores ivy bridge, 64 GB RAM)
echo "Logifle written to: build_data.log"
exec 3>&1 1>>build_data.log 2>&1

echo $(date)
start=$(date +%s)
npm i arangojs fastango3
echo "$(tput setaf 1)$(tput setab 7)------- Node packages installed (1/9) --------$(tput sgr 0)" 1>&3
rm -rf data
mkdir data
cd data
if wget -q https://s3.amazonaws.com/globi/snapshot/target/data/tsv/interactions.tsv.gz -nv; then echo "DL succesful"; else echo "GLoBI DL-link broken" 1>&3; exit 1;  fi
gunzip interactions.tsv.gz
if wget -q http://files.opentreeoflife.org/ott/ott3.0/ott3.0.tgz -nv; then echo "DL succesful"; else echo "OTL DL-link broken" 1>&3; exit 1;  fi
tar -xf ott3.0.tgz 
rm ott3.0.tgz 
mv ott/taxonomy.tsv . 
rm -rf ott
sed -i '27272s/kingdom/subkingdom/' taxonomy.tsv #correction rank of Chloroplastida
#sed -i '27272s/phylum/no rank/' taxonomy.tsv #Streptophyta
#sed -i '27272s/phylum/no rank/' taxonomy.tsv #Tracheophyta
#sed -i '27272s/phylum/no rank/' taxonomy.tsv #Magnoliophyta
#sed -i '27272s/kingdom/subkingdom/' taxonomy.tsv #Rhodophyta
#sed -i '27272s/kingdom/subkingdom/' taxonomy.tsv #Chlorophyta
wait
echo "$(tput setaf 1)$(tput setab 7)------- Tree and Interaction-data downloaded (2/9) --------$(tput sgr 0)" 1>&3
#Initializing the collections
arangosh --server.authentication false --javascript.execute-string 'db._drop("interaction_tsv");' 
arangoimp --file interactions.tsv --type tsv --collection interaction_tsv --create-collection true --server.authentication false
arangosh --server.authentication false --javascript.execute-string 'db._drop("nodes_otl");' 
arangosh --server.authentication false --javascript.execute-string 'db._drop("edges_otl");'
arangosh --server.authentication false --javascript.execute-string 'db._drop("nodes_otl_bak");' 
arangosh --server.authentication false --javascript.execute-string 'db._drop("edges_otl_bak");' 
arangosh --server.authentication false --javascript.execute-string 'db._createEdgeCollection("edges_otl");' 
arangosh --server.authentication false --javascript.execute-string 'db._create("nodes_otl");' 
arangosh --server.authentication false --javascript.execute-string 'db._createEdgeCollection("edges_otl_bak");' 
arangosh --server.authentication false --javascript.execute-string 'db._create("nodes_otl_bak");'
arangosh --server.authentication false --javascript.execute-string 'db._drop("counts");' 
arangosh --server.authentication false --javascript.execute-string 'db._create("counts");' 
#excluded Weinstein
arangosh --server.authentication false --javascript.execute-string 'db._drop("nodes_otl_nowein");' 
arangosh --server.authentication false --javascript.execute-string 'db._drop("edges_otl_nowein");' 
arangosh --server.authentication false --javascript.execute-string 'db._createEdgeCollection("edges_otl_nowein");' 
arangosh --server.authentication false --javascript.execute-string 'db._create("nodes_otl_nowein");'
#drop Weinstein sub-collections
arangosh --server.authentication false --javascript.execute-string 'db._drop("weinstein");' 
arangosh --server.authentication false --javascript.execute-string 'db._drop("weinstein_noott");' 
wait
echo "$(tput setaf 1)$(tput setab 7)------- Interactions imported and collections initialized (3/9) --------$(tput sgr 0)" 1>&3
cd ..
bash weinstein/build_weinstein-tsv.sh weinstein/weinstein_extract.md data/taxonomy.tsv &
node tagging/tag_interactionstsv_freelivings.js &
node tagging/tag_interactionstsv_paras.js &
node tagging/tag_interactionstsv_freelivingt.js &
node edgesimport_otl.js &
node nodesimport_otl.js &
wait
echo "$(tput setaf 1)$(tput setab 7)------- Interaction entries tagged Weinstein2016 data created OTL Tree imported (5/9) --------$(tput sgr 0)" 1>&3
node tagging/tag_tree_parasites_source.js &
node tagging/tag_tree_freeliving_target.js &
node tagging/tag_tree_freeliving_source.js &
wait
arangosh --server.authentication false --javascript.execute-string 'db._query("FOR doc in nodes_otl INSERT doc IN nodes_otl_nowein");' 
arangosh --server.authentication false --javascript.execute-string 'db._query("FOR doc in edges_otl INSERT doc IN edges_otl_nowein");'
arangosh --server.authentication false --javascript.execute-string 'db._query("FOR doc in edges_otl_nowein UPDATE doc WITH {_from: (SUBSTITUTE( doc._from, "nodes_otl", "nodes_otl_nowein" )), _to: (SUBSTITUTE( doc._to, "nodes_otl", "nodes_otl_nowein" )) } IN edges_otl_nowein");' 
echo "$(tput setaf 1)$(tput setab 7)------- Building parasite/freeliving collections done (6/9) --------$(tput sgr 0)" 1>&3
arangoimp --file weinstein/weinstein.tsv --type tsv --collection weinstein --create-collection true --server.authentication false 
arangoimp --file weinstein/weinstein_noOTT.tsv --type tsv --collection weinstein_noott --create-collection true --server.authentication false 
node weinstein/import_weinstein.js 
node weinstein/import_weinstein_noott.js 
echo "$(tput setaf 1)$(tput setab 7)------- Done importing weinstein2016 (7/9) --------$(tput sgr 0)" 1>&3
node counting/tag_counts.js
node counting/generate_counts.js 
node counting/phylla_count_parasites.js
node counting/phylla_count_freeliving.js
nohit=$(wc -l weinstein/weinstein_nohit.tsv | awk '{print $1}')
arangosh --server.authentication false --javascript.execute-string "db._update('counts/table', {'no Hits for Weinstein': $nohit})"
echo "$(tput setaf 1)$(tput setab 7)------- Done generating counts (8/9) --------$(tput sgr 0)" 1>&3
node write_pis.js
node taxonomic_majority_censoring.js
node find_origins.js
node counting/tag_originsTo_counts.js
node counting/tag_originsFrom_counts.js
node write_pis_nowein.js
node taxonomic_majority_censoring_nowein.js
node find_origins_nowein.js
node counting/tag_originsTo_counts_nowein.js
node counting/tag_originsFrom_counts_nowein.js
wait
rm -rf dump
arangodump --collection nodes_otl --collection edges_otl --output-directory "dump"
echo "$(tput setaf 1)$(tput setab 7)------- Done generating PIs, calculating origins and tag origin counts (9/9) --------$(tput sgr 0)" 1>&3
end=$(date +%s)
runtime=$(((end-start)/60))
echo "$runtime minutes" 
echo "$(tput setaf 1)$(tput setab 7)This run took $runtime minutes$(tput sgr 0)" 1>&3