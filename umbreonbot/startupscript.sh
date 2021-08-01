#!/bin/bash

VERSION_FILE="botversion.txt"

function get_current_version() {
  [[ -f $VERSION_FILE ]] && cat $VERSION_FILE || echo "0"
}

function get_latest_version() {
  curl https://umbreon.lol/bot/version -H "Accept: application/json" | jq '.version'
}

function should_download() {
  current=$1
  latest=$2
  if [[ "$current" = "$latest" ]]
  then
    false
  else
    true
  fi
}

function download_latest() {
  next_version=$1
  curl https://umbreon.lol/bot/download > umbreonbot
  chmod +x umbreonbot
  echo "$next_version" > $VERSION_FILE
}

function main() {
  echo "Getting current version"
  current_version=$(get_current_version)

  echo "Getting latest version"
  latest_available=$(get_latest_version)

  if should_download "$current_version" "$latest_available";
  then
    echo "Downloading new version"
    download_latest "$latest_available";
  else
    echo "Already on latest version ${current_version}";
  fi

  echo "Running"
  ./umbreonbot
}

main