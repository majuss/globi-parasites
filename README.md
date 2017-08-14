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
- look into origins of fungi and plants (per phyllum; check sum
- taxaNum of every child
- run pipeline with PI = 0.99

### Notes

If you get an error that says that node is out of memory, run it with more: `--max_old_space_size=16384`