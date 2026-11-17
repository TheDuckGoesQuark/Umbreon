# Project Umbreon

> Umbreon?
 
This tool was developed for the EV3, prounounced **ee-vee**-three. 
An evolution of the pokemon "Eevee" is called Umbreon.  

The three is missing but who cares.

## Layout

| Directory | What it is |
|---|---|
| `umbreonproto` | The messages the browser, server and bot exchange. The Rust crates compile against it; `umbreonwebclient/src/device/protocol.ts` mirrors it by hand. |
| `umbreonserver` | Relay server. The bot and each browser open a WebSocket to it, and it forwards messages between those that share a device id. Also serves the web build and the bot binary. |
| `umbreonbot` | Runs on the EV3 under [ev3dev](https://www.ev3dev.org). Connects out to the server, obeys commands, reports telemetry. |
| `umbreonwebclient` | React web app. |

## Running locally

No EV3 needed: `UMBREON_SIM=1` makes the bot print what the motors would do.

```sh
PORT=8080 cargo run -p umbreonserver
UMBREON_SIM=1 UMBREON_DEVICE_ID=sim-bot UMBREON_SERVER=ws://localhost:8080 cargo run -p umbreonbot
cd umbreonwebclient && yarn && yarn start:offline
```

The web dev server proxies `/api`, `/ws` and `/bot` to `UMBREON_SERVER_URL`, `http://localhost:8080` unless set.
