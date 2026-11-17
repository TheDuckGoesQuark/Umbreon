# Remaining work

The goal: a web app where a user logs in, registers their EV3, copies one script onto it, and from then on the brick updates itself at boot and can be driven from the browser over any network.

What runs today, on a development machine with a simulated bot: registering a device, the generated startup script downloading and starting the bot, the bot authenticating to the relay, and the browser driving it and reading telemetry. [README.md](../README.md) has the commands.

Everything below is untested or unbuilt. The sections are in the order I would take them, because each one removes a risk the next depends on.

## 1. Run the bot on a real EV3

Nothing has run on the brick. The bot has only been type-checked for its CPU (`cargo check --target armv5te-unknown-linux-gnueabi`), which skips linking.

- Build with `umbreonbot/bluetoothcopy.sh`. It needs [`cross`](https://github.com/cross-rs/cross) and a running Docker.
- **TLS.** The bot connects with plain `ws://`. A deployed server is behind HTTPS, so the bot needs `wss://`, which means enabling one of `tungstenite`'s TLS features. Whether any of them builds for `armv5te` is the open question, and the answer decides what follows:
  - it builds: `run_session` in `umbreonbot/src/main.rs` also needs to set the read timeout on the TLS variant of the stream, since it only handles the plain one;
  - it does not: give bots a plain-HTTP listener of their own, or terminate TLS for them some other way. The device token would then cross the network unencrypted, so that needs thought before shipping.
- Motor ports are fixed in `umbreonbot/src/hardware.rs`: left drive on D, right drive on A, claw on B. Check them against the build of the robot, and check the joystick's forward is the robot's forward.
- The claw stops when the motor reports a stall or after a timeout. The stall check is untested on hardware.
- `./startupscript.sh install` writes a systemd unit with `sudo` and enables it. Untested on ev3dev.

Done when: the brick is powered on with no laptop attached, appears online in the web app, and drives.

## 2. Log in with real Auth0

Local development bypasses login (`UMBREON_DEV_USER` on the server, `yarn start:offline` in the web client). The server's token check is covered by unit tests against a generated key, and has not been exercised against the Auth0 tenant.

- In Auth0, the tenant needs an API whose identifier is the server's `AUTH0_AUDIENCE`, signing with RS256.
- The web client needs `VITE_AUTH0_AUDIENCE` set to the same identifier, or Auth0 issues tokens the server will reject.

Done when: two different accounts each see only their own devices.

## 3. Deploy

The repository has no way to build or deploy the server. `terraform/` describes an ECS Fargate service behind a load balancer for `umbreon.lol`; whether that infrastructure still exists has not been checked.

- A Dockerfile for `umbreonserver`. The image also needs the web build and the cross-compiled bot binary in `ASSETS_DIR`.
- **Somewhere durable for the SQLite file** (`DATABASE_PATH`). The Fargate task in `terraform/cluster.tf` has no persistent volume, so registered devices would vanish on every deploy. Either mount an EFS volume or move to a host with a disk.
- `PUBLIC_URL` must be the address bots reach, since it is written into every startup script.
- `BOT_CODE_VERSION` must change whenever the bot binary does (the git SHA works), or bricks will not pick up new builds.
- A deploy job in `.github/workflows/main.yml`, which only builds and tests.

## 4. Finish the web app

- **Device settings** (`DeviceSettings.tsx`) is a placeholder. The server already has `DELETE /api/devices/{id}`; rename needs an endpoint.
- **The "I already have the connection code" branch** of the add-device wizard is a placeholder. A device's token cannot be shown twice, so re-linking a brick needs a "new token" endpoint that replaces the old one.
- The control screen titles itself with the device id; the name is in `GET /api/devices`.
- The device card has a `Busy` state that nothing sets. The relay forwards commands from every browser controlling a device, so two people can fight over one robot.

## 5. Predetermined tasks

The original idea included the bot running stored programs as well as taking live commands. Nothing exists for this: not the format of a task, where it is stored, or how the bot gets it. The protocol crate (`umbreonproto`) is where a new command would start.

## Smaller things

- `umbreonwebclient/src/device/protocol.ts` mirrors `umbreonproto/src/lib.rs` by hand. Generating it from the Rust types would stop them drifting.
- This repository is public and tracks two `.env` files and `terraform/terraform.tfstate.backup`. Terraform state can contain secrets; check it, and stop tracking it either way.
- If joystick lag is a problem once deployed, the fix is a direct browser-to-bot WebRTC data channel. The relay would stay, as the server the two sides use to find each other.
