#!/bin/bash

#scp startupscript.sh robot@ev3dev.local:/home/robot/

cross build --release --target armv5te-unknown-linux-gnueabi && scp target/armv5te-unknown-linux-gnueabi/release/umbreonbot robot@ev3dev.local:/home/robot/