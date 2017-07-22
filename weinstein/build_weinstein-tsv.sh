#!/bin/sh
#
# This file takes the extracted species/parasites list from Weinstein 2016
# and is getting the OTT-IDs for every entry from the taxonomy.tsv
# Format for Weinstein extract:
#
# Speciesname A
# Speciesname B
# Speciesname C
#
# You have to create this file manually with word 2013+ and the advaced search. Then search for bold printed strings inside the Weinstein2016
# supplementary data: http://datadryad.org/resource/doi:10.5061/dryad.70628
# You also should replace entries in your extract which are only made from one letter: "L. blackae"
# The file "weinstein_nohit.tsv" needs manuel reconstruction (or a search against GBIF/EOL)
#
# Second input file is the taxonomy.tsv from openTreeofLife

ottid=1000000000

rm weinstein/weinstein.tsv
rm weinstein/weinstein_noOTT.tsv
rm weinstein/weinstein_nohit.tsv
echo -e "_key\tsourceTaxonId\tsourceTaxonName\tinteractionTypeName\treferenceCitation" >> weinstein/weinstein.tsv 
echo -e "_key\tsourceTaxonId\tsourceTaxonName\tinteractionTypeName\tParentOTT\treferenceCitation" >> weinstein/weinstein_noOTT.tsv

while IFS='' read -r line || [[ -n "$line" ]]; do
    hit=$(grep "$line" "$2" | head -1 | awk -F "|" '{OFS="\t"; print $1,$1,$3,"parasiteOf","weinstein2016"}' | tr -s '\t')
    if [[ $hit ]]; then
            echo "$hit" >> weinstein/weinstein.tsv
    else
        hit2=$(echo $line | awk -F " " '{print $1}')
        if [ ${#hit2} -ge 3 ]; then
            hit3=$(grep "$hit2" "$2" | head -2 | tail -1)
            hit4=$(echo -e "$hit3" | awk -F "|" -v ottid="$ottid" -v sline="$line" '{OFS="\t"; print ottid,ottid,sline,"parasiteOf",$2,"weinstein2016"}' | tr -s '\t')
            if [[ $hit3 ]]; then
                echo "$hit4" >> weinstein/weinstein_noOTT.tsv
            else
                echo "$line" >> weinstein/weinstein_nohit.tsv
            fi
            ((ottid++))
        else
        echo "$line" >> weinstein/weinstein_nohit.tsv
        fi
    fi
done < "$1"

echo "Finished building Weinstein data"