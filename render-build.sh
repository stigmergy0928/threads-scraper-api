#!/usr/bin/env bash
set -e

curl -L \
  https://github.com/tamnd/threads-cli/releases/download/v0.1.1/th_0.1.1_amd64.deb \
  -o th.deb

dpkg-deb -x th.deb thpkg

cp thpkg/usr/bin/th ./th
chmod +x ./th

npm install
