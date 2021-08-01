#!/bin/bash

pushd ../umbreonwebclient || exit
BUILD_PATH=../umbreonserver/assets yarn build
popd || exit

pushd ../umbreonbot || exit
cross build --release --target armv5te-unknown-linux-gnueabi
mv target/armv5te-unknown-linux-gnueabi/release/umbreonbot ../umbreonserver/assets/
popd || exit

echo "Building docker image"
docker build . -t umbreonserver
echo "Running docker image"
docker run -p 0.0.0.0:3000:3000 -d umbreonserver:latest