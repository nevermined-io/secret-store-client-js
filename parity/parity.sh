#!/usr/bin/env bash

cd ./parity/

docker network create --subnet=172.15.0.1/24 ocean_secretstore

docker run -it -d \
    --net ocean_secretstore \
    --volume $(pwd)/keys:/home/parity/.local/keys/DevelopmentChain:ro \
    --name secretstore-parity \
    -p 9545:8545 \
    parity/parity:stable \
    --chain dev \
    --light \
    --jsonrpc-interface all \
    --jsonrpc-apis secretstore \
    --jsonrpc-cors all \
    --keys-path /home/parity/.local/keys

docker run -it -d \
    --net ocean_secretstore \
    --ip 172.15.0.13 \
    --entrypoint=/opt/parity/parity \
    -v $(pwd)/secret_store/config/:/etc/parity/secretstore/:ro \
    -v $(pwd)/secret_store/keys/:/parity_data/keys/ocean-network/:ro \
    --name secretstore \
    -p 12000:12000 \
    -p 12001:12001 \
    oceanprotocol/parity-ethereum:master \
    --config /etc/parity/secretstore/config.toml \
    --jsonrpc-interface all \
    --jsonrpc-hosts all \
    --jsonrpc-cors all \
    --jsonrpc-apis all