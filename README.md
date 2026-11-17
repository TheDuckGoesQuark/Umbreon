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

No EV3 or Auth0 login needed. `UMBREON_DEV_USER` makes the server treat every request as that user, and `yarn start:offline` gives the web app a matching fake login.

```sh
PORT=8080 PUBLIC_URL=http://localhost:8080 UMBREON_DEV_USER=dev cargo run -p umbreonserver
cd umbreonwebclient && yarn && yarn start:offline
```

Register a device in the web app's add-device wizard and save the startup script it gives you. The script carries that device's id and token. To run a bot for it on this machine, copy the three `export` lines out of the script into a shell, then:

```sh
UMBREON_SIM=1 cargo run -p umbreonbot
```

`UMBREON_SIM=1` makes the bot print what the motors would do. The web dev server proxies `/api`, `/ws` and `/bot` to `UMBREON_SERVER_URL`, `http://localhost:8080` unless set.

## Server configuration

| Variable | Meaning |
|---|---|
| `PORT` | Listen port. |
| `PUBLIC_URL` | The address bots reach the server at, written into each startup script. |
| `DATABASE_PATH` | SQLite file holding registered devices. |
| `ASSETS_DIR` | Directory holding the web build and the `umbreonbot` binary served at `/bot/download`. |
| `AUTH0_DOMAIN`, `AUTH0_AUDIENCE` | Auth0 tenant and API identifier that user tokens are checked against. |
| `UMBREON_DEV_USER` | Skips Auth0 and treats every request as this user. Local development only. |
| `BOT_CODE_VERSION` | Version string bots compare against to decide whether to download. |

What is left to build is in [docs/remaining-work.md](docs/remaining-work.md).
