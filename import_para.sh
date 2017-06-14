#!/bin/bash

node build_parasites-collection.js
node uild_freeliving_target.js
node build_freeliving_source.js
node weinstein/import_weinstein.js
node weinstein/import_weinstein_noott.js







# In the future this should all be ks modularized and fully automated from start to finish
# 
#
#
#
#
#
#

#!/usr/bin/arangosh --server.authentication false	
#db._create("myapp");
