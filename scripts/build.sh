#!/usr/bin/env bash

VUE_APP_GITHUB_CALLBACK_URL=$1 VUE_APP_AUTH_API_URL=$2 VUE_APP_GITHUB_CLIENT_ID=$3 VUE_APP_GOOGLE_CLIENT_ID=$4 VUE_APP_GOOGLE_AUTH_CALLBACK=$5 VUE_APP_API_URL=$6 VUE_APP_HAS_AUTH=$7 VUE_APP_AUTH_USERNAME=$8 VUE_APP_AUTH_PASSWORD=$9 HOST=${10} quasar build

VUE_APP_GITHUB_CALLBACK_URL=$1 VUE_APP_AUTH_API_URL=$2 VUE_APP_GITHUB_CLIENT_ID=$3 VUE_APP_GOOGLE_CLIENT_ID=$4 VUE_APP_GOOGLE_AUTH_CALLBACK=$5 VUE_APP_API_URL=$6 VUE_APP_HAS_AUTH=$7 VUE_APP_AUTH_USERNAME=$8 VUE_APP_AUTH_PASSWORD=$9 HOST=${10} quasar build -m ssr
