echo "Starting usermanager service..."
npm start || {
  exitCode=$?
  echo "Failed to start usermanager service."
  echo "Exiting with error code $exitCode"
  exit $exitCode
}