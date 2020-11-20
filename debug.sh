#!/bin/sh

# Envs
GH_NAME=''
GH_EMAIL=''
GH_TOKEN=''

# Script
cd docs
git pull origin HEAD:master
yarn install
cd website
yarn install
yarn build
cd ../..
git config --global user.name "${GH_NAME}"
git config --global user.email "${GH_EMAIL}"
echo "machine github.com login ${GH_NAME} password ${GH_TOKEN}" > ~/.netrc
cd docs/website && GIT_USER="${GH_NAME}" yarn run publish-gh-pages
