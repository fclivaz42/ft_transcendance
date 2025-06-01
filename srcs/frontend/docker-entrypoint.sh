echo Cleaning up old build artifacts...
rm -rf ./dist > /dev/null 2> /dev/null || true
rm -rf /var/www/sarif-frontend > /dev/null 2> /dev/null|| true
echo Building sarif_frontend...
npm run build
mkdir -p /var/www/sarif-frontend
mv ./dist /var/www/sarif-frontend/dist
cp -rf ./public /var/www/sarif-frontend/public
echo Done building sarif_frontend.
echo Exiting sarif_frontend docker-entrypoint.sh...
exit 0