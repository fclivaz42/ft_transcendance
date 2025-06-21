#!/bin/sh
echo "Starting oauth2 module..."
exec npm run start || {
  exitCode=$?
  echo "Failed to start usermanager service."
  echo "Exiting with error code $exitCode"
  exit $exitCode
}