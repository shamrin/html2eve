#!/bin/bash

set -e

mkdir -p build/
cp browser/* build/
cp node_modules/systemjs/dist/system{,-polyfills}.js build/
tsc $1 $2 $3 $4