# Current thoughts

- Hash and fp are calculated locally, set membership algo is **only for the query**. (Documents are stored in redis separately with a key that is a hash of the query.)
- `cf.delete` command should have 2 arguments: hash of query, fp
- (If hash of fingerprint should also be determined by the client side, then we need 3 arguments from the client side.)
- use Redis Set/SortedSet for buckets

---

DELETE command pseudocode (from Cuckoo paper):

```pseudocode
f = ﬁngerprint(x); // calculated locally
i1 = hash(x); // calculated locally
i2 = i1 ⊕ hash(f); // calculated at server?

if bucket[i1] or bucket[i2] has f then
    remove a copy of f from this bucket; 
    return True;
return False;
```

Implementations steps
1. Receives i1 and fp in arguments.
2. Check bucket i1, if true, remove fp. **Return** true.
3. Hash fp, calculate i2.
4. Check bucket i2, if true, remove fp. **Return** true.
5. If neither, just say nothing is deleted. I don't think we need to return a RedisError since there is no error.

---

- INSERT:

```pseudocode
// partial-key cuckoo hashing
f = ﬁngerprint(x);
i1 = hash(x);
i2 = i1 ⊕ hash(f);

if bucket[i1] or bucket[i2] has an empty entry then
    add f to that bucket;
    return Done;

// must relocate existing items
i = randomly pick i1 or i2 ;
for n = 0; n < MaxNumKicks; n++ do
    randomly select an entry e from bucket[i];
    swap f and the ﬁngerprint stored in entry e;
    i = i ⊕ hash(f);

    if bucket[i] has an empty entry then 
        add f to bucket[i]; 
        return Done;

// Hashtable is considered full
return Failure;
```

---

- SEARCH:

```pseudocode
f = ﬁngerprint(x);
i1 = hash(x); 
i2 = i1 ⊕ hash(f);

if bucket[i1] or bucket[i2] has f then 
   return True;
return False;
```

# Local testing without Docker

- Running `cargo build --release` on macOS generates a `.dylib` file rather than `.so`file for the module.

- The redis docker image is based on Linux, so it cannot load this module. 

- I started a redis session in command line (local env), and tested `cf.insert` and `cf.delete` commands together.

- For testing within Docker container, check instructions in README on Fam's **ProbAlgo-45** branch.

# Confusions (outdated)
- No matter the query exists beforehand or not, running `cf.delete` always returns false. 
  
- I suspect the reason is that a new cuckoo_filter object is instantiated each time when `cf.delete` is called, so the filter is just empty. 
  
- DELETE function works, but cuckoo_filter behavior is wrong. 

- But if I do not create a new object, I need to find a way to access the cuckoo_filter object in global env.