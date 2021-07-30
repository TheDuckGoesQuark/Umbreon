#!/bin/bash

pushd ../umbreonwebclient || exit
yarn build
popd || exit

sudo docker build . -t umbreonserver
sudo docker run umbreonserver:latest