# GLoBIs parasites

Here is the workflow to reproduce the current findings:

**1. connect to the VM thats running arangoDB:**
```
ssh h -L 127.0.0.1:8529:127.0.0.1:8529 -p 15350 -q
```
**2. Setup arangoDB and node.v8 and disable arangos authentication (etc/arangodb3/arangod.conf)**

**3. Run the data-building script:**
```
bash build_data.sh
```

# ToDo's

**Currently working on:**
- get subtree of common ranks to visualize it in sunburst
- analyse origins from weinonly and nowein

### Notes

Link to current thesis notes: https://www.icloud.com/pages/0WoWKFUxix2AGOxT9zIJHGtzA#ma_copy

If you get an error that says that node is out of memory, run it with more: `--max_old_space_size=16384`