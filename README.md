# GLoBIs parasites

Here is the workflow to reproduce the current findings:

**1. connect to the VM thats running arangoDB:**
```
ssh h -L 127.0.0.1:8529:127.0.0.1:8529 -p 15350 -q
```
**2. Setup arangoDB and node.v8 and disable arangos authentication (`sudo nano etc/arangodb3/arangod.conf` and restart arangodb with `sudo service arangodb3 restart` afterwards.)**

**3. Run the data-building script:**
```
bash build_data.sh
```

# ToDo's

**Currently working on:**
- show correlation between parasitism/freeliving count (subtree) and number of origins
- look into origins of fungi and plants (per phyllum; check sum
- taxaNum of every child
- phylum under phlyum -> outbound filter v.rank == "phylum"
- better PI assignment -> outbound 0..3 == 0
- run pipeline with PI = 0.99

### Notes

If you get an error that says that node is out of memory, run it with more: `--max_old_space_size=16384`