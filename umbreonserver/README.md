# Umbreon Server

The server establishes a connection between bot and client web app, 
allowing a user to control the robot remotely and see the output from it's sensors.

## How to run

Run `./run.sh` which will
1. build the web client and copy the assets over to the server
2. build the robot code that will be served at /bot/download
3. build the docker image for the server with all the assets included
4. run the docker image locally

## How it works

First, the user signs in to their account in the webapp.

The webapp allows the user to generate an API key, which has to be manually copied over to the robot somehow.

The robot then connects to the server using that API key whenever it is turned on, allowing the user to see when it is 
connected and online.

The user can then begin sending commands to that robot and see the values output from it's sensors.

### Dev Setup
Techs needed:
* Docker
* Rust
  * Cargo
  * Cross
* Golang
* Vite

Follow instructions [here](https://github.com/pixix4/ev3dev-lang-rust) to get ev3dev set up