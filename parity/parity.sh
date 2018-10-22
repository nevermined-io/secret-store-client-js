#!/usr/bin/env bash

parity --chain dev account import UTC--2018-10-22T13-20-36Z--46ece274-a8e8-d274-019b-0377b67f7ab7.json
parity --chain dev --jsonrpc-apis secretstore --jsonrpc-port 9545
