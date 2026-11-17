#!/bin/bash
# `./startupscript.sh install` makes this run whenever the EV3 boots.

export UMBREON_SERVER="{{SERVER_URL}}"
export UMBREON_DEVICE_ID="{{DEVICE_ID}}"
export UMBREON_TOKEN="{{DEVICE_TOKEN}}"

cd "$(dirname "$(readlink -f "$0")")" || exit 1

VERSION_FILE="botversion.txt"
SERVICE_FILE="/etc/systemd/system/umbreonbot.service"

function install_service() {
  sudo tee "$SERVICE_FILE" > /dev/null <<UNIT
[Unit]
Description=Umbreon bot
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
User=$(whoami)
ExecStart=$(readlink -f "$0")
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT
  sudo systemctl daemon-reload
  sudo systemctl enable --now umbreonbot.service
}

function update() {
  local current latest
  current=$(cat "$VERSION_FILE" 2> /dev/null || echo "none")
  if ! latest=$(curl --fail --silent --show-error "$UMBREON_SERVER/bot/version"); then
    echo "Could not reach $UMBREON_SERVER, keeping version $current"
    return
  fi
  if [[ "$current" == "$latest" ]]; then
    echo "Already on latest version $current"
    return
  fi

  echo "Downloading version $latest"
  # Downloaded beside the old binary and swapped in only once complete, so a
  # dropped connection cannot leave a half-written bot.
  if curl --fail --silent --show-error "$UMBREON_SERVER/bot/download" --output umbreonbot.new; then
    chmod +x umbreonbot.new
    mv umbreonbot.new umbreonbot
    echo "$latest" > "$VERSION_FILE"
  else
    rm -f umbreonbot.new
    echo "Download failed, keeping version $current"
  fi
}

if [[ "$1" == "install" ]]; then
  install_service
  exit
fi

update
if [[ ! -x umbreonbot ]]; then
  echo "No bot binary yet"
  exit 1
fi
exec ./umbreonbot
