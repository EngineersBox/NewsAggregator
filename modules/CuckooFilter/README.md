# Redis Cuckoo Filter

See design doc on confluence

## Build the module locally
1. Run the following command to build .so file
    ```
    cargo build --release
    ```
2. Check `target/release` contains the right .so file linked in `dockerfile`.

3. Run `docker-compose up -d` to run the docker container

4. Run `docker exec -it <container-ID> sh` to access the container

4. Run the added Redis commands `cf.insert <query-key> <json>`
