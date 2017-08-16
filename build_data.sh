#!/bin/bash

# Build system for everything this will take about 200 minutes (8 cores ivy bridge, 64 GB RAM)
echo "Logifle written to: build_data.log"
exec 3>&1 1>>build_data.log 2>&1            #write stdout 1,2 to logfile 3 to console
echo $(date)
start=$(date +%s)                           #get starting date
npm i arangojs fastango3 bfj jsonexport     #install js packages
echo "$(tput setaf 1)$(tput setab 7)------- Node packages installed (1/8) --------$(tput sgr 0)" 1>&3 1>&2
rm -rf data                                 #delete preexisting data dir
mkdir data                                  #make data dir
cd data                                     #change dir into data
if wget -q https://s3.amazonaws.com/globi/snapshot/target/data/tsv/interactions.tsv.gz -nv; then echo "GLoBI DL succesful"; else echo "GLoBI DL-link broken" 1>&3; exit 1;  fi                      #download interactions.tsv and post error msg if link is unreachable
gunzip interactions.tsv.gz
if wget -q http://files.opentreeoflife.org/ott/ott3.0/ott3.0.tgz -nv; then echo "OTT DL succesful"; else echo "OTL DL-link broken" 1>&3; exit 1;  fi    # download OTT and post error msg if link is unreachable
tar -xf ott3.0.tgz                          #untar OTT
rm ott3.0.tgz                               #remove .tar
mv ott/taxonomy.tsv .                       #move taxonomy into data dir
rm -rf ott                                  #remove OTT dir
sed -i '27272s/kingdom/subkingdom/' taxonomy.tsv #correction rank of Chloroplastida inside OTT
wait
echo "$(tput setaf 1)$(tput setab 7)------- Tree and Interaction-data downloaded (2/8) --------$(tput sgr 0)" 1>&3 1>&2
#Initializing the collections
arangosh --server.authentication false --javascript.execute-string 'db._drop("interaction_tsv");
                                                                    db._drop("counts");
                                                                    db._drop("weinstein");
                                                                    db._drop("weinstein_noott");
                                                                    db._create("counts");'
#dropping and creating all nec. collections inside arangoDB (moved partially into the js modules)
arangoimp --file interactions.tsv --type tsv --collection interaction_tsv --create-collection true --server.authentication false    #import interactions.tsv into arangoDB
arangosh --server.authentication false --javascript.execute-string 'col = db.interaction_tsv; col.load()'                           #load the interaction col
wait
echo "$(tput setaf 1)$(tput setab 7)------- Interactions imported and collections initialized (3/8) --------$(tput sgr 0)" 1>&3 1>&2
cd ..
bash weinstein/build_weinstein-tsv.sh weinstein/weinstein_extract.md data/taxonomy.tsv      #assign Weinstein entries an OTT-ID
node tagging/tag_interactionstsv_freelivings.js                                             #tag freeliving (source) interaction entries in interacion_tsv
node tagging/tag_interactionstsv_parass.js                                                  #tag parasites (source) interaction entries in interacion_tsv
node tagging/tag_interactionstsv_parast.js                                                  #tag parasites (target) interaction entries in interacion_tsv
node tagging/tag_interactionstsv_freelivingt.js                                             #tag freeliving (target) interaction entries in interacion_tsv
node edgesimport_otl.js &                                                                   #import OTT into edge collection
node nodesimport_otl.js                                                                     #import OTT into nodes collection
wait
arangosh --server.authentication false --javascript.execute-string 'db._query("FOR doc in nodes_otl INSERT doc IN nodes_otl_bak");
                                                                    db._query("FOR doc in edges_otl INSERT doc IN edges_otl_bak");' 
#create nodes/edges OTT backup
echo "$(tput setaf 1)$(tput setab 7)------- Interaction entries tagged; Weinstein2016 data created; OTL Tree imported (4/8) --------$(tput sgr 0)" 1>&3 1>&2
node build_freeliving_source.js                     #build sub-tree from freeliving (source) tagged interaction_tsv entries
node build_freeliving_target.js                     #build sub-tree from freeliving (target) tagged interaction_tsv entries
node build_parasites_source.js                      #build sub-tree from parasites (source) tagged interaction_tsv entries
node build_parasites_target.js                      #build sub-tree from parasites (target) tagged interaction_tsv entries
wait
arangosh --server.authentication false --javascript.execute-string 'db._query("FOR doc in nodes_otl_sub INSERT doc IN nodes_otl_sub_bak");
                                                                    db._query("FOR doc in edges_otl_sub INSERT doc IN edges_otl_sub_bak");' 
#create nodes/edges OTT-subtree backup
wait
echo "$(tput setaf 1)$(tput setab 7)------- builded otl subtree (5/8) --------$(tput sgr 0)" 1>&3 1>&2
arangoimp --file weinstein/weinstein.tsv --type tsv --collection weinstein --create-collection true --server.authentication false           #import auto assigned Weinstein entries
arangoimp --file weinstein/weinstein_manual.tsv --type tsv --collection weinstein --create-collection false --server.authentication false   #import manually assigned Weinstein entries
node write_pis.js                       #write PIs to subtree
node taxonomic_majority_censoring.js    #start TMC on subtree
node find_origins.js                    #tag origins
echo "$(tput setaf 1)$(tput setab 7)------- TMC done, origins found (6/8) --------$(tput sgr 0)" 1>&3 1>&2
node tagging/tag_origins_toTree.js      #transfer tagged origins to full OTT tree
arangosh --server.authentication false --javascript.execute-string 'db._query(`UPDATE "304358" with {freeliving:1, freelivingw:1} in nodes_otl`);'  #set the root node freeliving
node tagging/tag_ott_pfl.js             #tag fl/p according to origins on full tree
node tagging/tag_ott_pfl_wein.js        #tag fl/p according to weinstein origins
echo "$(tput setaf 1)$(tput setab 7)------- Finished extrapolating full-tree (7/8) --------$(tput sgr 0)" 1>&3 1>&2
node counting/generate_counts.js        #generate a table inside collection counts
node weinstein/import_origin_counts.js  #importing _from origin counts per phylum from weinstein paper
node counting/tag_counts_fulltree.js    #tagging underlying counts to phylum - family
###
node counting/generate_counts2.js       #write table to disk about nr of extrapolated taxa
node analysis/find_shortpathes.js       #get table of path lengthes written to disc
node visualisation/extract_ranks.js     #extracting a subset for metazoa sunburst
node visualisation/colorise_extract.js  #colorise the extract for sunburst
echo "$(tput setaf 1)$(tput setab 7)------- Done generating PIs, calculating origins and tag origin counts (8/8) --------$(tput sgr 0)" 1>&3
end=$(date +%s)                         #get end-date
runtime=$(((end-start)/60))             #calculate runtime
echo "$runtime minutes" 
echo "$(tput setaf 1)$(tput setab 7)This run took $runtime minutes$(tput sgr 0)" 1>&3


#nodes for vis: save website as .html and jage es durch awk '/<svg/,/svg>/' sunburst.html > sunburst.svg
#dann durch inkscape: inkscape -z -e sunburst.png -w 10000 -h 10000 sunburst.svg