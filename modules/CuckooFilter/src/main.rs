extern crate redis;
use redis::Commands;
use probabilistic_collections::cuckoo::CuckooFilter;

fn main() {
    let size = std::env::args().nth(1).expect("Please specify the size of the filter");
    let action = std::env::args().nth(2).expect("Please specify an action");
    let item = std::env::args().nth(3).expect("Please specify an item");
    
    println!("size of the filter {:?}", size);

    let mut cuckoo_filter = CuckooFilter::<String>::new(size.parse::<usize>().unwrap());

    if action == "add"{
        cuckoo_filter.insert(&item);
        match add(item) {
            Ok(_) => println!("Item added"),
            Err(why) => println!("An error occured: {}", why),
        }

    }
       
}


fn add(item: String) -> redis::RedisResult<()> {
    let client = redis::Client::open("redis://127.0.0.1/")?;
    let mut con = client.get_connection()?;

    let _: () = redis::cmd("SET")
    .arg(item)
    .arg("hash1")
    .query(&mut con)?;

    Ok(())
}
