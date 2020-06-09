#!/usr/bin/env bash

PASSPHRASE=$PROD_GPG_SECRET
FILE=demoenv.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$PASSPHRASE" --output ./demoenv "$FILE"
