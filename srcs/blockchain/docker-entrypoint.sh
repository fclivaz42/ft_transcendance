#!/bin/sh
echo "Starting blockchaine service..."

npx hardhat compile || {
  exitCode=$?
  echo "Failed to start blockchaine service."
  echo "Exiting with error code $exitCode"
  exit $exitCode
}

exec npm run main || {
  exitCode=$?
  echo "Failed to start blockchaine service."
  echo "Exiting with error code $exitCode"
  exit $exitCode
}
