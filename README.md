# NewsAggregator

## installation

Setting up this repository is very straight forward, simply run the following to get all the dependencies configured.

```bash
make install
```

## Build the UI with Docker

Running the UI for searching keywords is done via a dockerized compilation of the frontend. To compile it into a docker container, run the following:

```bash
make build_docker_ui
```

To run the container use the following:

```bash
make start_docker_ui
```

## Run the flask UI

```bash
make start_flask
```