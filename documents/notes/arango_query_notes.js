/*#arango db queries

/* Please insert some values for the @@collection1 and @@collection2 bind parameters */
//FOR doc1 IN @@collection1
//  FOR doc2 IN @@collection2
//    FILTER doc1.`attribute` == doc2.`attribute`
//    RETURN { doc1, doc2 }


//for doc in nodes_otl
//filter lower(doc.name) == "metazoa"
//return doc

/*
return count (
for doc in interaction_tsv
filter contains(doc.sourceTaxonIds, "OTT:")
return doc
)*/

/* Please insert some values for the @@collection1 and @@collection2 bind parameters */
//FOR doc1 IN @@collection1
//  FOR doc2 IN @@collection2
//    FILTER doc1.`attribute` == doc2.`attribute`
//    RETURN { doc1, doc2 }


//for doc in nodes_otl
//filter lower(doc.rank) == "domain"
//return doc


//for doc in nodes_otl
//filter contains(doc.name, "sapiens")
//return doc

//for doc in  (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl/304358' TO 'nodes_otl/5341349' GRAPH 'otl' return e)
//filter doc
//insert merge({_id:concat('aosdf/', doc._key)}, doc) in aosdf { ignoreErrors: true }
//
//
//for doc in  (FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl/304358' TO 'nodes_otl/5341349' GRAPH 'otl' return v)
//filter doc
//insert merge({_id:concat('aosdf/', doc._key)}, doc) in aosdf { ignoreErrors: true }

//for doc in interaction_tsv limit 100 return doc


//FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl/304358' TO 'nodes_otl/5341349' GRAPH 'otl' return v



//
//for v,e,p in 1..n outbound startid edgescol
//
//Filter p.vertices[-1] == homosapiensid
//
//Return p



//concat(phyll.phylla, 
//concat('otl_parasites_edges/', doc._key)

/*

const phyllaNames = ["Acanthocephala", "Annelida", "Arthropoda", "Brachiopoda", "Bryozoa", "Chaetognatha", "Chordata", "Cnidaria", "Ctenophora", "Cycliophora", "Echinodermata", "Entoprocta", "Gastrotricha", "Gnathostomulida", "Hemichordata", "Kinorhyncha", "Loricifera", "Micrognathozoa", "Mollusca", "Nematoda", "Nematomorpha", "Nemertea", "Onychophora", "Orthonectida", "Phoronida", "Placozoa", "Platyhelminthes", "Porifera", "Priapulida", "Rhombozoa", "Rotifera", "Sipuncula", "Tardigrada", "Xenacoelomorpha"];


const phyllaOTT = [];
async function counting() {

    for (let i = 0; i < phyllaNames.length; i++) {

        let result = await db.query(`
            for doc in otl_parasites_nodes
            filter contains(doc.name, '${phyllaNames[i]}')
            filter doc.rank == 'phylum'
            //UPDATE "phylla" with{phyllaOTT: doc._key} in counts OPTIONS { ignoreErrors: true } 
            return doc._key`);
        console.log (phyllaNames[i], result._result);
        phyllaOTT.push(result._result);
        //console.log(phyllaOTT);
    }

}
counting();




`
FOR v,e IN 1..100 outbound 'otl_parasites_nodes/691846' otl_parasites_edges
    filter v.rank == 'phylum'
    RETURN v
`
*/


//return count(
//for doc in interaction_tsv
//filter doc.interactionTypeName == 'parasiteOf' ||
//doc.interactionTypeName == 'ectoParasiteOf'||
//doc.interactionTypeName == 'kleptoparasiteOf' ||
//doc.interactionTypeName == 'ectoParasitoid' ||
//doc.interactionTypeName == 'endoparasiteOf' ||
//doc.interactionTypeName == 'parasitoidOf' ||
//doc.interactionTypeName == 'endoparasitoidOf'
//return distinct doc.sourceTaxonName
//)


//return count(
//for doc in interaction_tsv
//filter doc.interactionTypeName == 'preyedUponBy' ||
//doc.interactionTypeName == 'ectoParasitoid'||
//doc.interactionTypeName == 'parasiteOf' ||
//doc.interactionTypeName == 'ectoParasiteOf' ||
//doc.interactionTypeName == 'kleptoparasiteOf' ||
//doc.interactionTypeName == 'visitsFlowersOf' ||
//doc.interactionTypeName == 'endoparasitoidOf'||
//doc.interactionTypeName == 'parasitoidOf'||
//doc.interactionTypeName == 'endoparasiteOf'
//return distinct doc.targetTaxonName
//)

//for doc in otl_parasites_nodes
//filter doc.name == 'Myxozoa'
//return doc

//for doc in otl_parasites_nodes
//filter doc.name == 'SAR'
//return doc

//for doc in otl_parasites_nodes
//filter doc.parasite == 1 && doc.freeliving == 1
//return doc.interactionTypeNameP

//for doc in otl_parasites_nodes
//filter doc.globi == 1 && doc.weinstein == 1
//return doc

//FOR v,e IN 1..100 outbound 'otl_parasites_nodes/691846' otl_parasites_edges
//    filter v.rank == 'phylum'
//    RETURN v

//return count(
//for doc in interaction_tsv
//filter doc.freeliving == 1 && doc.parasite == 1
//return distinct doc.pfname)

//for node in otl_parasites_nodes
//filter node.parasite != 1 && node.freeliving != 1
//
//return node


//
//    for doc in otl_parasites_nodes
//    filter doc.rank == 'phylum'
//    filter contains(doc.name, 'Sipuncula')
//    return doc



//FOR v,e IN OUTBOUND SHORTEST_PATH 'nodes_otl/304358' TO 'nodes_otl/412087' GRAPH 'otl' return v


//
//FOR v,e IN 1..100 outbound 'otl_parasites_nodes/395057' otl_parasites_edges
//          filter v.rank == 'class'
//          RETURN v

//FOR v,e IN 1..100 outbound 'otl_parasites_nodes/125642' otl_parasites_edges
//          filter v.parasite == 1
//          RETURN v



//for dok in otl_parasites_nodes
//insert dok in otl_parasites_nodes_bak

//FOR v,e IN 1..100 outbound 'otl_parasites_nodes/304358' otl_parasites_edges
//          filter v.rank == 'kingdom'
//          RETURN v

/*
FOR v,e IN 1..100 outbound 'otl_parasites_nodes/304358' otl_parasites_edges
          filter v.rank == 'kingdom'
          RETURN v*/

//for doc in interaction_tsv
//return distinct doc.interactionTypeName

//for doc in otl_parasites_nodes_bak
//INSERT doc in otl_parasites_nodes




//FOR v,e IN 1..100 outbound 'otl_parasites_nodes/304358' otl_parasites_edges
//    filter v.rank == 'kingdom'
//    sort v.name asc
//    RETURN v

//return distinct doc.rank
//
//filter doc.parasite == 0 || doc.freeliving == 0
//update doc with {pi: 0.5} in otl_parasites_nodes
//
//insert doc in otl_bak
//
//filter doc.pi == null
//update doc with { pi: 0.5} in otl_parasites_nodes


//filter doc.rank != 'species' && doc.rank != 'genus' && doc.rank != 'subspecies' && doc.parasite == 1 && doc.parasite == 1
//update doc WITH { pi: 0.55 } in otl_parasites_nodes
//return doc


//filter doc.pi == 0.55
//return doc




//for node in otl_parasites_nodes

//filter node.pi == null
//return node
//filter node.pi >= 0.9
//
//return distinct node.pi


//return count(
//FOR node IN otl_parasites_nodes
//        FILTER 0 == length(
//        FOR v,e,p IN OUTBOUND node._id otl_parasites_edges
//        RETURN v)
//        RETURN node._id)


//FOR v,e IN INBOUND SHORTEST_PATH 'otl_parasites_nodes/5137581' TO 'otl_parasites_nodes/304358' otl_parasites_edges
//filter v.pi != 0.5
//return v

//for node in otl_parasites_nodes
// filter 0 == length(
//    FOR v,e IN INBOUND SHORTEST_PATH node TO 'otl_parasites_nodes/304358' otl_parasites_edges
//    return v
// )
// return node //check if every node is connected

//return count(
//for doc in otl_parasites_nodes
//filter doc.pi == 0.5
//return doc)

//for doc in otl_parasites_edges return DOCUMENT([doc._from, doc._to])

//for doc in otl_parasites_nodes
//filter doc.parasite == 0 || doc.freeliving == 0
//update doc with {pi: 0.5} in otl_parasites_nodes

//for doc in otl_parasites_nodes
//filter doc.parasite == 0 || doc.freeliving == 0
//update doc with {pi: 0.5} in otl_parasites_nodes


//for doc in otl_parasites_edges
//return doc

//RETURN DOCUMENT('nodes_otl/304358').name

//for doc in otl_parasites_nodes
//FILTER doc.origin2 == 1
//return doc._originIDs



//for doc in otl_parasites_nodes
//filter doc.sourceTaxonName == "Trichodectes canis"
//return distinct doc
//filter doc.name == "Tardigrada"
//return doc

//for doc in otl_parasites_nodes
//filter doc.name == "Chloroplastida"
//filter doc.rank == "class"
//filter doc.name == "Archaeplastida"

//return doc

//FOR v,e IN 1..100 OUTBOUND 'otl_parasites_nodes/5268475' otl_parasites_edges
//FILTER v.rank == "phylum"
//RETURN v.name


//FOR node IN otl_parasites_nodes
//FILTER 0 == length(
//FOR v,e,p IN OUTBOUND node._id otl_parasites_edges
//RETURN v)
//RETURN node._id


//FOR v,e IN INBOUND SHORTEST_PATH 'otl_parasites_nodes/5137581' TO 'otl_parasites_nodes/304358' otl_parasites_edges


//return count(
//FOR v,e IN INBOUND SHORTEST_PATH 'otl_parasites_nodes/3671425' TO 'otl_parasites_nodes/304358' otl_parasites_edges RETURN e)

//for doc in otl_parasites_nodes_nowein
//FILTER doc.name == "Metazoa"
//return doc

//FOR v,e IN 1..100 outbound 'otl_parasites_nodes_nowein/304358' otl_parasites_edges_nowein
//    filter v.rank == 'kingdom'
//    RETURN v