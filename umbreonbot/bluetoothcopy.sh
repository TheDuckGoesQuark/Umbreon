#!/bin/bash

target_dir=$(cargo metadata --format-version 1 --no-deps | jq -r .target_directory)

cross build --release -p umbreonbot --target armv5te-unknown-linux-gnueabi && scp "$target_dir/armv5te-unknown-linux-gnueabi/release/umbreonbot" robot@ev3dev.local:/home/robot/
