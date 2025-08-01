#!/bin/sh
if [ -z "$CERT_PATH" ] || [ -z "$KEY_PATH" ]; then
  echo "CERT_PATH or KEY_PATH environment variable is not set."
  echo "Using default paths: /etc/ssl/certs/sarif.crt and /etc/ssl/private/sarif.key"
  export CERT_PATH="/etc/ssl/certs/sarif.crt"
  export KEY_PATH="/etc/ssl/private/sarif.key"
else
  echo "Using provided paths: $CERT_PATH and $KEY_PATH"
fi
if [ ! -f "$CERT_PATH" ] || [ ! -f "$KEY_PATH" ]; then
  echo "Missing certificate or key file $KEY_PATH or $CERT_PATH"
  echo "Generating self-signed certificate..."
  mkdir -p /etc/ssl/certs /etc/ssl/private
  openssl req -x509 -newkey rsa:2048 -nodes -keyout $KEY_PATH -out $CERT_PATH -days 365 -subj "/C=CH/ST=Vaud/L=Lausanne/O=42/OU=42/CN=*.42lausanne.ch/UID=SARIF"
  if [ $? -ne 0 ]; then
    echo "Failed to generate self-signed certificate."
    exit 1
  fi
  echo "Self-signed certificate generated successfully."
else
  echo "Using provided certificate and key paths in $KEY_PATH and $CERT_PATH"
fi
echo "Ignoring TLS verification: ${IGNORE_TLS:-false}"

echo "Starting core service..."
exec npm run start || {
  exitCode=$?
  echo "Failed to start core service."
  echo "Exiting with error code $exitCode"
  exit $exitCode
}