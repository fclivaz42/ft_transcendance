#!/bin/bash

[ -z $1 ] && echo "No target folder given" && exit

for line in $(find . -name ".env"); do
	cp $line "$1/$line"
done
