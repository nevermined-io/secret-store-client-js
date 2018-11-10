#!/usr/bin/env bash

cd ./parity/

docker run -it -d \
    --volume $(pwd)/keys:/home/parity/.local/keys/DevelopmentChain:ro \
    --name secretstore-parity \
    -p 9545:8545 \
    parity/parity:stable \
    --chain dev \
    --light \
    --jsonrpc-interface 0.0.0.0 \
    --jsonrpc-apis secretstore \
    --keys-path /home/parity/.local/keys
