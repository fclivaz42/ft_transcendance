#!/bin/sh

#Defining cleanup procedure
cleanup() {
	echo "Exiting..."
	rm -rf ./node_modules
	exit $?
}

#Trapping the SIGTERM
trap 'cleanup' SIGTERM

#Execute a command
npm run $RUNMODE &

#Wait
wait $!
