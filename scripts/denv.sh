#!/usr/bin/env bash

PASSPHRASE=$DEV_GPG_SECRET
FILE=devenv.gpg

sudo gpg --quiet --batch --yes --decrypt --passphrase="$PASSPHRASE" --output ./env "$FILE"
cp env ./public
