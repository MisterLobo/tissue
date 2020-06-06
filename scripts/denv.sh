#!/usr/bin/env bash

PASSPHRASE=$mysecret
FILE=devenv.gpg

sudo gpg --quiet --batch --yes --decrypt --passphrase="$PASSPHRASE" --output ./devenv "$FILE"
