# GloBIs parasites

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

After that you can start scripts inside visualisation to generate the sunbursts. The generated tables are stored in analysis/generated_tables



![CC](https://i.creativecommons.org/l/by-nc/4.0/88x31.png)
This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License.](http://creativecommons.org/licenses/by-nc/4.0/)