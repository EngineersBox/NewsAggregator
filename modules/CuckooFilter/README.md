# Local testing without Docker

- Running `cargo build --release` on macOS generates a `.dylib` file rather than `.so`file for our module.

- The redis docker image is based on Linux, so it cannot load this module. 

- I started a redis session in command line (local env), and tested `cf.insert` and `cf.delete` commands together.

- For testing within Docker container, check instructions in README on Fam's **ProbAlgo-45** branch.

# Questions
- No matter the query exists beforehand or not, running `cf.delete` always returns false. 
  
- I suspect the reason is that a new cuckoo_filter object is instantiated each time when `cf.delete` is called, so the filter is just empty. 
  
- DELETE function works, but cuckoo_filter behavior is wrong. 

- But if I do not create a new object, I need to find a way to access the cuckoo_filter object in global env.