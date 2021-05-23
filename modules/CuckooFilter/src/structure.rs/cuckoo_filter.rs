// Structure of Cuckoo Filter
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use rand::Rng;
use rand::seq::SliceRandom;
//Constants. These parameters are recommended in the cuckoo paper
const ENTRIES_PER_BUCKET = 4, //b
const MAX_NUMBER_KICKS = 500
// ord() in python results in ASCII code which has 7 bits.
const FINGERPRINT_LENGTH = 7  //f
const EMPTY_BUCKET_DATA: [u8; ENTRIES_PER_BUCKET] = [0; ENTRIES_PER_BUCKET];


pub struct Bucket {
    pub data: [u8; ENTRIES_PER_BUCKET];
}

impl Bucket {
    fn new() -> Self {
        Self {
            data = EMPTY_BUCKET_DATA;
        }
    }

}

pub struct CuckooFilter {
    // Pass as arguement
    name: String,
    capacity: String, // Number of items to store in this cuckoo filter

    // Either assign default values or calculcate
    number_of_buckets: u8, //m

    // Not sure if this is still needed
    buckets: [Bucket;number_of_buckets],

}

// The minimum size of the cuckoo filter is 1024 (pow(2,10))
fn calculcate_number_of_buckets(arg_capacity: String) -> u8{

    let invalid_size = arg_capacity.len() < 2 || arg_capacity.len() > 4
    match invalid_size{
        false => println!("Error in size input"),
        true => println!("Valid size input")
    }

    let pow_1024;
    match arg_capacity.pop().to_lowercase() {
        'k' => pow_1024 = 1024,
        'm' => pow_1024 = 1024 * 1024,
        'g' => pow_1024 = 1024 * 1024 * 1024,
        _ => println!("Error in size metric. Could only allow k, m, g"),
    }

    // Parse the remaining numeric of the arg_capacity
    let num = arg_capacity.parse::<i32>().unwrap();
    let number_of_buckets;

    match num{
        1 || 2 || 4 || 8 || 16 || 32 || 64 || 128 ||256 || 512 => number_of_buckets = num*pow_1024,
        _ => println!("Error in the size number. Could only allow 1,2,4,...."),
    };

    return number_of_buckets;
}

fn find_relative_buckets<T: Hash>(fingerprint: &T, query: &T) -> Vec<u64> {
    let mut vec = Vec::with_capacity(2);
    
    let mut h1 = DefaultHasher::new();
    query.hash(&mut h1);
    vec.push(h1.finish());
    let mut h2 = DefaultHasher::new();
    h1.finish() ^ fingerprint.hash(&mut h2);
    vec.push(h2.finish());
    return vec;
}

fn add_element_to_bucket(bucket: String, query: String) {
    // Initialise the bucket name and add the new element into the bucket list
    ctx.call("LPUSH", &[bucket, query]);
    ctx.call("LPUSH", &[query, bucket]);

    let query_expire_name = ":expire";
    query.push_str(query_expire_name);

    ctx.call("SETEX", &[query, 60, 1]);  // Set the frequency of the query
}

// TTL
// https://stackoverflow.com/questions/29785346/redis-client-to-listen-to-set-and-del-events
// https://github.com/redis/redis/issues/6020
// https://www.programmersought.com/article/89301264743/
// initialise with init.
fn expired_keys_notification(ctx: &Context) -> RedisResult{
    let key_expire = ctx.call("PSUBSCRIBE", &["__keyspace@0__:expire"]);
    if key_expire != "" {
        let key_remove:Vec<&str>= key_expire.split(":").collect();
        let buckets:Vec<&str> = ctx.call("LRANGE", &[key_remove[0], 0, -1]);
        for bucket in buckets{
            ctx.call("LREM", &[bucket, 0, key_remove[0]]);
        }
    }
}

fn bucket_name(cf_name: String, hash: String) -> &str {
    // Check if <cf_name>-bucket-<number> exists
    let mut bucket_name = cf_name;
    bucket_name.push_str(":bucket#");
    bucket_name.push_str(hash);

    return bucket_name;
}

impl CuckooFilter {

    pub fn new(&mut self, arg_name: String, arg_capacity: u8, ctx: &Context) -> Self {
        Self {
            name = arg_name,
            capacity = arg_capacity,

            // Parameters depending on the arguements
            number_of_buckets = calculcate_number_of_buckets(arg_capacity),
            buckets = [Bucket::new(); number_of_buckets];

            if ctx.call("HGET", &[arg_name, "capacity"]) == 0 {
                ctx.call("HSET", &[arg_name, "capacity", arg_capacity, "Number of Buckets", number_of_buckets]);
            };
            //TODO: will this run at th background constantly
            expired_keys_notification(ctx);
        }
    }

    pub fn add(ctx: &Context, mut cf_name: String, query: T, fingerprint: T){
        let hashes = find_relative_buckets(query,fingerprint);

        let bucket_name_h1 = bucket_name(cf_name, hashes[0].to_string());
        let bucket_name_h2 = bucket_name(cf_name, hashes[1].to_string());

        // LLEN will return 0 if list does not exists
        let elements_in_bucket_h1 = ctx.call("LLEN", &[bucket_name_h1]);
        let elements_in_bucket_h2 = ctx.call("LLEN", &[bucket_name_h2]);

        let mut rng = rand::thread_rng();
        let mut chosen_hash = hashes.choose(&mut rng);
        if elements_in_bucket_h1 == ENTRIES_PER_BUCKET && elements_in_bucket_h2 == ENTRIES_PER_BUCKET{
            let mut rng = rand::thread_rng();
            for n in 0..MAX_NUMBER_KICKS-1{
                let index =  rng.gen_range(0..3);
                let chosen_bucket = bucket_name(cf_name, chosen_hash.to_string());
                
                // Find the bucket list with the elements
                let bucket_list:Vec<&str> = ctx.call("LRANGE", &[chosen_bucket, 0, -1]);
                // Load the bucket
                self.buckets[chosen_hash] = bucket_list;

                // Start relocating the element
                // swap the entry and the new f
                let new_f = self.buckets[chosen_hash][index]
                self.buckets[chosen_hash][index] = query

                let mut hash = DefaultHasher::new();
                new_f.hash(&mut hash);
                let bucket_name_new = bucket_name(cf_name, hashes[0].to_string());

                let elements_in_new_bucket = ctx.call("LLEN", &[bucket_name_new]);

                if elements_in_new_bucket != 4 {
                    add_element_to_bucket(bucket_name_new, new_f);
                    // Not sure Return what here to break
                }
            }
        } else if elements_in_bucket_h1 == ENTRIES_PER_BUCKET {
            add_element_to_bucket(bucket_name_h2, query);
        } else{
            add_element_to_bucket(bucket_name_h1, query)
        }
    } 

}