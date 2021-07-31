#!/bin/bash

pushd ../umbreonwebclient || exit
yarn build
popd || exit

echo "Building docker image"
docker build . -t umbreonserver
echo "Running docker image"
docker run -p 0.0.0.0:3000:3000 -d umbreonserver:latest