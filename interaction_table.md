# Markdown table of GLoBIs interaction types and which are relevant for us

### parasitic interaction (source)
Source species of this interaction type are certainly parasites.
### parasitic interaction (target)
Target species of this interation type are cerstainly parasites.
### freeliving interaction (source)
Source species of this interaction type are certainly free living.
### freeliving interaction (target)
Target species of this interaction type are certainly free living.
### in question
These interaction types need further evaluation, if they can be used to determine if a species is parasitic or free living.
### not useful
You cannot determine if the species is free living or parasitic with the help of this interaction type.

parasitic interaction (source)|parasitic interaction (target)| freeliving interaction (source) | freeliving interaction (target)|in question|not useful|no definition
---|---|---|---|---|---|---
**hasHost**|**hostOf** The term host is usually used for the larger (macro) of the two members of a symbiosis (GO)|**visits**| |**eatenBy**|**livesNear**|**ectoParasitoid**(61)
**parasiteOf**| |**preysOn** An interaction relationship involving a predation process, where the subject kills the target in order to eat it or to feed to siblings, offspring or group members| |**parasitoidOf** A parasite that kills or sterilizes its host|**interactsWith**  An interaction relationship in which at least one of the partners is an organism and the other is either an organism or an abiotic entity with which the organism interacts|**livesNear**(131)
**ectoParasiteOf** A sub-relation of parasite-of in which the parasite lives on or in the integumental system of the host||**eats**| |**pollinatedBy** is target of pollination interaction with; has polinator|**visitsFlowersOf**|**livesUnder**(113)
**kleptoparasiteOf** A sub-relation of parasite of in which a parasite steals resources from another organism, usually food or nest material||||**hasParasite**|**pollinates** This relation is intended to be used for biotic pollination - e.g. a bee pollinating a flowering plant. Some kinds of pollination may be semibiotic - e.g. wind can have the role of pollinator. We would use a separate relation for this.|**inhabits**(15)
**ectoParasitoid**| | | |**hasDispersalVector** a dispersal vector is "an agent transporting seeds or other dispersal units". Dispersal vectors may include biotic factors, such as animals, or abiotic factors, such as the wind or the ocean|**farms** (1)|**endoparasitoidOf**(1462)
 | | | |**hasVector**| |**livesInsideOf**(583)
 | | | |**symbiontOf** A biotic interaction in which the two organisms live together in more or less intimate association| |**guestOf**(141)
 | | | |**pathogenOf**| |**livesOn**(1073)
 | | | |**adjacentTo** X adjacent to y if and only if x and y share a boundary|
 | | | |**flowersVisitedBy**|
 | | | |**endoparasiteOf** A sub-relation of parasite-of in which the parasite lives inside the host, beneath the integumental system; Types|
 | | | |**preyedUponBy** Inverse of preys on|
 | | | |**hasPathogen**|
 | | | |**dispersalVectorOf** A dispersal vector is an agent transporting seeds or other dispersal units. Dispersal vectors may include biotic factors, such as animals, or abiotic factors, such as the wind or the ocean|
 | | | |**vectorOf**|
 | | | |**kills**| |

## Raw interaction type IDs

Interaction | ID
---|---
kills|http://purl.obolibrary.org/obo/RO_0002626
visits|http://purl.obolibrary.org/obo/RO_0002618
farms|no:match
vectorOf|http://purl.obolibrary.org/obo/RO_0002459
kleptoparasiteOf|http://purl.obolibrary.org/obo/RO_0008503
ectoParasitoid|no:match
livesNear|no:match
hasVector|http://purl.obolibrary.org/obo/RO_0002460
livesUnder|no:match
inhabits|no:match
livesInsideOf|no:match
guestOf|no:match
adjacentTo|http://purl.obolibrary.org/obo/RO_0002220
flowersVisitedBy|http://purl.obolibrary.org/obo/RO_0002623
endoparasiteOf|http://purl.obolibrary.org/obo/RO_0002634
livesOn|no:match
endoparasitoidOf|no:match
preyedUponBy|http://purl.obolibrary.org/obo/RO_0002458
hasPathogen|http://purl.obolibrary.org/obo/RO_0002557
dispersalVectorOf|http://eol.org/schema/terms/DispersalVector
parasitoidOf| http://purl.obolibrary.org/obo/RO_0002208
eatenBy|http://purl.obolibrary.org/obo/RO_0002471
hasParasite|http://purl.obolibrary.org/obo/RO_0002445
hasDispersalVector|http://eol.org/schema/terms/HasDispersalVector
pollinates|http://purl.obolibrary.org/obo/RO_0002455
ectoParasiteOf|http://purl.obolibrary.org/obo/RO_0002632
preysOn|http://purl.obolibrary.org/obo/RO_0002439
symbiontOf|http://purl.obolibrary.org/obo/RO_0002440
pathogenOf|http://purl.obolibrary.org/obo/RO_0002556
visitsFlowersOf|http://purl.obolibrary.org/obo/RO_0002622
hostOf|http://purl.obolibrary.org/obo/RO_0002453
pollinatedBy|http://purl.obolibrary.org/obo/RO_0002456
interactsWith|http://purl.obolibrary.org/obo/RO_0002437
parasiteOf|http://purl.obolibrary.org/obo/RO_0002444
hasHost|http://purl.obolibrary.org/obo/RO_0002454
eats|http://purl.obolibrary.org/obo/RO_0002470