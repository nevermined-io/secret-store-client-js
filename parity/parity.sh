#!/usr/bin/env bash

cd ./parity/

docker run -it \
    --volume $(pwd)/keys/:/root/.local/share/io.parity.ethereum/keys/DevelopmentChain \
    --name secretstore-parity \
    -p 9545:8545 \
    parity/parity:stable \
    --chain dev \
    --jsonrpc-interface 0.0.0.0 \
    --jsonrpc-apis secretstore