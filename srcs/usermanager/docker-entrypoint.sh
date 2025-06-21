#!/bin/sh
echo "Starting usermanager service..."
exec npm run start || {
  exitCode=$?
  echo "Failed to start usermanager service."
  echo "Exiting with error code $exitCode"
  exit $exitCode
}