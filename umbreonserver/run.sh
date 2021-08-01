#!/bin/bash

pushd ../umbreonwebclient || exit
yarn build
popd || exit

pushd ../umbreonbot || exit
cross build --release --target armv5te-unknown-linux-gnueabi
cp target/armv5te-unknown-linux-gnueabi/release/umbreonbot ../umbreonserver/assets/
popd || exit

echo "Building docker image"
docker build . -t umbreonserver
echo "Running docker image"
docker run -p 0.0.0.0:3000:3000 -d umbreonserver:latest