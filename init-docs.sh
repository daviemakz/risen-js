#!/bin/sh

# Initialise submodule
git submodule update --init --recursive

# Download submodules
git submodule update --remote --merge

# Install docs
cd docs
yarn install

# Install website
cd website
yarn install

# Back to root
cd ../..
