#!/bin/sh

#Defining cleanup procedure
cleanup() {
	echo "Exiting..."
	rm -rf ./node_modules
	exit $?
}

#Trapping the SIGTERM
trap 'cleanup' SIGTERM

export API_KEY="$(cat /run/secrets/api-key)"

#Execute a command
npm run $RUNMODE &

#Wait
wait $!
